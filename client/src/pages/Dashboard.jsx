import { useEffect, useState } from "react";
import axios from "axios";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Container,
} from "@mui/material";

function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    totalSubmissions: 0,
    avgRating: 0,
  });

  useEffect(() => {
    axios
      .get("/api/students")
      .then((res) => {
        const students = res.data;
        const totalStudents = students.length;
        const activeStudents = students.filter(
          (s) =>
            new Date(s.lastUpdated) >
            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        ).length;
        const totalSubmissions = students.reduce(
          (sum, s) => sum + (s.submissions?.length || 0),
          0
        );
        const avgRating =
          totalStudents > 0
            ? students.reduce((sum, s) => sum + (s.currentRating || 0), 0) /
              totalStudents
            : 0;

        setStats({
          totalStudents,
          activeStudents,
          totalSubmissions,
          avgRating: avgRating.toFixed(2),
        });
      })
      .catch((err) => console.error("Error fetching stats:", err));
  }, []);

  const StatCard = ({ title, value }) => (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h5" component="div">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 10 }}>
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold">
          Dashboard
        </Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Students" value={stats.totalStudents} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Students (Last 7 Days)"
            value={stats.activeStudents}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Submissions" value={stats.totalSubmissions} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Average Rating" value={stats.avgRating} />
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;
