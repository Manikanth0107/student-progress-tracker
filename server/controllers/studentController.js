const studentService = require("../services/student");
const { syncStudentData } = require("../services/dataSync");
const {
  fetchUserSubmissions,
  fetchUserContests,
  fetchContestProblems,
} = require("../services/codeforcesAPI");

const createStudent = async (req, res) => {
  try {
    console.log("POST /api/students received:", req.body);
    const student = await studentService.createStudent(req.body);
    res.status(201).json(student);
  } catch (error) {
    console.error("Create student error:", error);
    res.status(400).json({ error: error.message });
  }
};

const getStudentById = async (req, res) => {
  try {
    console.log(`GET /api/students/${req.params.id} received`);
    const student = await studentService.getStudentById(req.params.id);
    res.json(student);
  } catch (error) {
    console.error("Get student error:", error);
    res.status(404).json({ error: error.message });
  }
};

const getAllStudents = async (req, res) => {
  try {
    console.log("GET /api/students received");
    const students = await studentService.getAllStudents();
    res.json(students);
  } catch (error) {
    console.error("Get all students error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const updateStudent = async (req, res) => {
  try {
    console.log(`PUT /api/students/${req.params.id} received:`, req.body);
    const student = await studentService.updateStudent(req.params.id, req.body);
    res.json(student);
  } catch (error) {
    console.error("Update student error:", error);
    res.status(400).json({ error: error.message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    console.log(`DELETE /api/students/${req.params.id} received`);
    const student = await studentService.deleteStudent(req.params.id);
    res.json({ message: "Student deleted", student });
  } catch (error) {
    console.error("Delete student error:", error);
    res.status(404).json({ error: error.message });
  }
};

const syncStudentRatings = async (req, res) => {
  try {
    console.log("POST /api/students/sync-ratings received");
    const result = await syncStudentData();
    res.json(result);
  } catch (error) {
    console.error("Sync ratings error:", error);
    res.status(500).json({ error: error.message });
  }
};

const getStudentSubmissions = async (req, res) => {
  try {
    console.log(`GET /api/students/submissions/${req.params.handle} received`);
    const { handle } = req.params;
    const { limit = 100, from = 1, days } = req.query;

    if (!(await studentService.validateCodeforcesHandle(handle))) {
      throw new Error("Invalid Codeforces handle");
    }

    const submissions = await fetchUserSubmissions(handle, {
      limit: Number(limit),
      from: Number(from),
      days: days ? Number(days) : undefined,
    });
    res.json(submissions);
  } catch (error) {
    console.error("Get submissions error:", error);
    res.status(400).json({ error: error.message });
  }
};

const getStudentContests = async (req, res) => {
  try {
    console.log(`GET /api/students/contests/${req.params.handle} received`);
    const { handle } = req.params;
    const { days } = req.query;
    const filterDays = days ? Number(days) : null;

    if (!(await studentService.validateCodeforcesHandle(handle))) {
      throw new Error("Invalid Codeforces handle");
    }

    const contests = await fetchUserContests(handle, { days: filterDays });

    const now = Date.now() / 1000;
    const visibleContests = contests.filter(
      (c) => now - c.ratingUpdateTimeSeconds > 60 * 60
    );

    // ✅ Run unsolvedCount fetches in parallel
    await Promise.all(
      visibleContests.map(async (contest) => {
        // If unsolvedCount already exists in DB, skip fetch
        if (contest.unsolvedCount !== undefined) return;

        try {
          const { unsolvedCount } = await fetchContestProblems(
            handle,
            contest.contestId
          );
          contest.unsolvedCount = unsolvedCount;

          // ✅ Cache the value in the Student model
          await studentService.saveContestUnsolvedCount(
            handle,
            contest.contestId,
            unsolvedCount
          );
        } catch (error) {
          console.error(
            `Failed to fetch problems for contest ${contest.contestId}:`,
            error
          );
          contest.unsolvedCount = null;
        }
      })
    );

    res.json(visibleContests);
  } catch (error) {
    console.error("Get contests error:", error);
    res.status(400).json({ error: error.message });
  }
};

const getStudentAnalytics = async (req, res) => {
  try {
    const { handle } = req.params;
    const { days = 30 } = req.query;

    if (!(await studentService.validateCodeforcesHandle(handle))) {
      throw new Error("Invalid Codeforces handle");
    }

    const filterDays = days === "All" ? undefined : Number(days);
    const submissions = await fetchUserSubmissions(handle, {
      days: filterDays,
    });

    const solvedProblems = [];
    const problemSet = new Set();
    submissions.forEach((sub) => {
      if (
        sub.verdict === "OK" &&
        sub.problem.rating &&
        !problemSet.has(`${sub.problem.contestId}-${sub.problem.index}`)
      ) {
        solvedProblems.push(sub.problem);
        problemSet.add(`${sub.problem.contestId}-${sub.problem.index}`);
      }
    });

    const totalSolved = solvedProblems.length;
    const averageRating =
      totalSolved > 0
        ? solvedProblems.reduce((sum, p) => sum + p.rating, 0) / totalSolved
        : 0;
    const mostDifficult =
      totalSolved > 0
        ? solvedProblems.reduce((max, p) =>
            p.rating > (max.rating || 0) ? p : max
          )
        : null;
    const avgPerDay = filterDays ? totalSolved / filterDays : 0;

    const buckets = {};
    solvedProblems.forEach((p) => {
      const bucketStart = Math.floor(p.rating / 200) * 200;
      const bucketKey = `${bucketStart}-${bucketStart + 200}`;
      buckets[bucketKey] = (buckets[bucketKey] || 0) + 1;
    });

    const ratingBuckets = Object.entries(buckets)
      .map(([range, count]) => {
        const [start, end] = range.split("-").map(Number);
        return { rangeStart: start, rangeEnd: end, count };
      })
      .sort((a, b) => a.rangeStart - b.rangeStart);

    res.json({
      totalSolved,
      averageRating,
      mostDifficult,
      avgPerDay,
      ratingBuckets,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createStudent,
  getStudentById,
  getAllStudents,
  updateStudent,
  deleteStudent,
  syncStudentRatings,
  getStudentSubmissions,
  getStudentContests,
  getStudentAnalytics,
};
