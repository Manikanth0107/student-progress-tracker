import { useState, useContext, useEffect } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  ButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Link,
} from "@mui/material";
import useStudent from "../hooks/useStudent";
import { ThemeContext } from "../context/ThemeContext";
import SubmissionHeatmap from "../components/student/SubmissionHeatmap";
import RatingChart from "../components/student/RatingChart";
import ProblemRatingBarChart from "../components/student/ProblemRatingBarChart";

function StudentProfilePage() {
  const { id } = useParams();
  const { student, isLoading, error } = useStudent(id);
  const { theme } = useContext(ThemeContext);
  const [contestFilter, setContestFilter] = useState(365);
  const [problemFilter, setProblemFilter] = useState(30);
  const [contestData, setContestData] = useState([]);
  const [problemData, setProblemData] = useState({
    totalSolved: 0,
    averageRating: 0,
    mostDifficult: null,
    avgPerDay: 0,
    ratingBuckets: [],
  });

  useEffect(() => {
    if (!student || !student.codeforcesHandle) return;

    const loadData = async () => {
      try {
        const daysParam =
          contestFilter === "All" ? "" : `?days=${contestFilter}`;
        const res = await fetch(
          `/api/students/contests/${student.codeforcesHandle}${daysParam}`
        );
        const data = await res.json();
        setContestData(data);
      } catch (err) {
        console.error("Failed to load contest data:", err);
      }
    };

    loadData();
  }, [student, contestFilter]);

  useEffect(() => {
    if (!student || !student.codeforcesHandle) return;

    const fetchProblemStats = async () => {
      try {
        const daysParam =
          problemFilter === "All" ? "" : `?days=${problemFilter}`;
        const res = await fetch(
          `/api/students/analytics/${student.codeforcesHandle}${daysParam}`
        );
        if (!res.ok) throw new Error("Failed to load problem data");
        const data = await res.json();
        setProblemData(data);
      } catch (error) {
        console.error("Failed to load problem data:", error);
      }
    };

    fetchProblemStats();
  }, [student, problemFilter]);

  if (isLoading) return <Typography align="center">Loading...</Typography>;
  if (error)
    return (
      <Typography align="center" color="error">
        {error}
      </Typography>
    );
  if (!student)
    return <Typography align="center">Student not found</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 10 }}>
      <Box mb={2}>
        <Link component={RouterLink} to="/students" underline="hover">
          ← Back to Students
        </Link>
      </Box>

      <Card variant="outlined" sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {student.name}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography>Email: {student.email}</Typography>
              <Typography>Phone: {student.phone || "N/A"}</Typography>
              <Typography>
                Codeforces:{" "}
                <Link
                  href={`https://codeforces.com/profile/${student.codeforcesHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {student.codeforcesHandle}
                </Link>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>
                Current Rating: {student.currentRating || "N/A"}
              </Typography>
              <Typography>Max Rating: {student.maxRating || "N/A"}</Typography>
              <Typography>
                Last Updated:{" "}
                {new Date(student.lastUpdated).toLocaleDateString()}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box mb={4}>
        <Typography variant="h5" gutterBottom>
          Contest History
        </Typography>
        <ButtonGroup sx={{ mb: 2 }}>
          {[30, 90, 365, "All"].map((days) => (
            <Button
              key={days}
              variant={contestFilter === days ? "contained" : "outlined"}
              onClick={() => setContestFilter(days)}
            >
              {days === "All" ? "All Time" : `Last ${days} Days`}
            </Button>
          ))}
        </ButtonGroup>

        <RatingChart contestData={contestData} filterDays={contestFilter} />

        {contestData.length > 0 ? (
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Contest</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Rank</TableCell>
                  <TableCell>Rating Change</TableCell>
                  <TableCell>Unsolved Problems</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contestData.map((contest) => (
                  <TableRow key={contest.ratingUpdateTimeSeconds}>
                    <TableCell>{contest.contestName}</TableCell>
                    <TableCell>
                      {new Date(
                        contest.ratingUpdateTimeSeconds * 1000
                      ).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{contest.rank}</TableCell>
                    <TableCell
                      sx={{
                        color:
                          contest.newRating - contest.oldRating > 0
                            ? "green"
                            : contest.newRating - contest.oldRating < 0
                            ? "red"
                            : "text.primary",
                        fontWeight: 500,
                      }}
                    >
                      {contest.newRating - contest.oldRating >= 0 ? "+" : ""}
                      {contest.newRating - contest.oldRating}
                    </TableCell>

                    <TableCell>{contest.unsolvedCount || 0}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography sx={{ mt: 2 }} color="text.secondary">
            No contests found for the selected period.
          </Typography>
        )}
      </Box>

      <Box mb={4}>
        <Typography variant="h5" gutterBottom>
          Problem Solving Data
        </Typography>
        <ButtonGroup sx={{ mb: 2 }}>
          {[7, 30, 90, "All"].map((days) => (
            <Button
              key={days}
              variant={problemFilter === days ? "contained" : "outlined"}
              onClick={() => setProblemFilter(days)}
            >
              {days === "All" ? "All Time" : `Last ${days} Days`}
            </Button>
          ))}
        </ButtonGroup>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <Typography>
              Most Difficult:{" "}
              {problemData.mostDifficult
                ? `${problemData.mostDifficult.name} (Rating: ${problemData.mostDifficult.rating})`
                : "N/A"}
            </Typography>
            <Typography>Total Solved: {problemData.totalSolved}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography>
              Average Rating: {(problemData.averageRating ?? 0).toFixed(2)}
            </Typography>
            <Typography>
              Avg/Day: {(problemData.avgPerDay ?? 0).toFixed(2)}
            </Typography>
          </Grid>
        </Grid>

        <ProblemRatingBarChart
          codeforcesHandle={student.codeforcesHandle}
          filterDays={problemFilter}
          setProblemData={setProblemData}
        />
        <SubmissionHeatmap
          codeforcesHandle={student.codeforcesHandle}
          filterDays={problemFilter}
        />
      </Box>
    </Container>
  );
}

export default StudentProfilePage;
