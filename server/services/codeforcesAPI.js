const axios = require("axios");

const BASE_URL = "https://codeforces.com/api";

const fetchUserInfo = async (handle) => {
  try {
    console.log(`Fetching user info for handle: ${handle}`);
    const response = await axios.get(`${BASE_URL}/user.info?handles=${handle}`);
    if (!response.data.result || response.data.result.length === 0) {
      throw new Error("User not found");
    }
    return response.data.result[0];
  } catch (error) {
    console.error(`Failed to fetch user info for ${handle}:`, error.message);
    throw new Error("Failed to fetch user info");
  }
};

const fetchUserContests = async (handle, { days } = {}) => {
  const normalizedHandle = handle.trim().toLowerCase();

  try {
    console.log(`Fetching contests for handle: ${normalizedHandle}`);
    const response = await axios.get(
      `${BASE_URL}/user.rating?handle=${normalizedHandle}`
    );

    console.log("Codeforces contest API response:", response.data); // 👈 Add this

    if (!response.data.result || response.data.result.length === 0) {
      throw new Error("No contest data found");
    }

    let contests = response.data.result;

    if (days && !isNaN(days)) {
      const cutoff = Date.now() / 1000 - days * 24 * 60 * 60;
      contests = contests.filter((c) => c.ratingUpdateTimeSeconds >= cutoff);
    }

    return contests;
  } catch (error) {
    console.error(
      `Failed to fetch contests for ${normalizedHandle}:`,
      error.message
    );
    throw new Error("Failed to fetch user contests");
  }
};

const fetchUserSubmissions = async (
  handle,
  { limit = 100, from = 1, days } = {}
) => {
  try {
    console.log(
      `Fetching submissions for handle: ${handle} with limit=${limit}, from=${from}${
        days ? `, days=${days}` : ""
      }`
    );
    const response = await axios.get(
      `${BASE_URL}/user.status?handle=${handle}&from=${from}&count=${limit}`
    );
    if (!response.data.result) {
      throw new Error("No submission data found");
    }
    let submissions = response.data.result;
    if (days && !isNaN(days)) {
      const cutoff = Date.now() / 1000 - days * 24 * 60 * 60;
      submissions = submissions.filter((x) => x.creationTimeSeconds >= cutoff);
    }

    return submissions;
  } catch (error) {
    console.error(`Failed to fetch submissions for ${handle}:`, error.message);
    throw new Error("Failed to fetch user submissions");
  }
};

const fetchContestProblems = async (handle, contestId) => {
  try {
    console.log(
      `Fetching problems for contest ${contestId} for handle: ${handle}`
    );
    const problemResponse = await axios.get(
      `${BASE_URL}/contest.standings?contestId=${contestId}&showUnofficial=false`
    );
    if (!problemResponse.data.result || !problemResponse.data.result.problems) {
      throw new Error("No problems found for contest");
    }
    const problems = problemResponse.data.result.problems;

    const submissionResponse = await axios.get(
      `${BASE_URL}/contest.status?contestId=${contestId}&handle=${handle}`
    );
    if (!submissionResponse.data.result) {
      throw new Error("No submissions found for contest");
    }
    const submissions = submissionResponse.data.result;

    const solved = new Set();
    submissions.forEach((sub) => {
      if (sub.verdict === "OK") {
        solved.add(`${sub.problem.contestId}-${sub.problem.index}`);
      }
    });

    const unsolvedCount = problems.filter(
      (p) => !solved.has(`${p.contestId}-${p.index}`)
    ).length;

    return { unsolvedCount };
  } catch (error) {
    console.error(
      `Failed to fetch contest problems for ${contestId}:`,
      error.message
    );
    throw new Error("Failed to fetch contest problems");
  }
};

module.exports = {
  fetchUserInfo,
  fetchUserContests,
  fetchUserSubmissions,
  fetchContestProblems,
};
