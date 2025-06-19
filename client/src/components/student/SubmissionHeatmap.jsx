import { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import CalHeatmap from "cal-heatmap";
import "cal-heatmap/cal-heatmap.css";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Chip,
  Divider,
  useTheme,
} from "@mui/material";
import { ThemeContext } from "../../context/ThemeContext";

function SubmissionHeatmap({ codeforcesHandle, filterDays }) {
  const { theme } = useContext(ThemeContext);
  const muiTheme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      setIsLoading(true);
      setError("");
      try {
        const res = await axios.get(
          `/api/students/submissions/${codeforcesHandle}?days=${filterDays}`
        );
        setSubmissions(res.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch submissions");
      } finally {
        setIsLoading(false);
      }
    };

    if (codeforcesHandle) fetchSubmissions();
  }, [codeforcesHandle, filterDays]);

  useEffect(() => {
    if (submissions.length === 0) return;

    const cal = new CalHeatmap();
    const days = Math.max(parseInt(filterDays, 10) || 30, 1);

    const data = submissions.reduce((acc, sub) => {
      const date = new Date(sub.creationTimeSeconds * 1000);
      const dateStr = date.toISOString().split("T")[0];
      acc[dateStr] = (acc[dateStr] || 0) + 1;
      return acc;
    }, {});

    const heatmapData = Object.entries(data).map(([date, count]) => ({
      t: Math.floor(new Date(date).getTime() / 1000),
      v: Math.max(0, count),
    }));

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    cal.paint(
      {
        data: { source: heatmapData, x: "t", y: "v" },
        date: { start: startDate },
        range: Math.ceil(days / 30),
        scale: {
          color: {
            scheme: theme === "dark" ? "Blues" : "Greens",
            type: "linear",
            min: 0,
            max: Math.max(...heatmapData.map((d) => d.v), 1),
          },
        },
        domain: { type: "month", padding: 2 },
        subDomain: {
          type: "day",
          radius: 3,
          width: 14,
          height: 14,
          label: "D",
        },
        theme: theme === "dark" ? "dark" : "light",
      },
      []
    );

    return () => cal.destroy();
  }, [submissions, theme, filterDays]);

  return (
    <Paper
      elevation={3}
      sx={{
        mt: 4,
        p: { xs: 2, sm: 3 },
        bgcolor: muiTheme.palette.mode === "dark" ? "#1e1e1e" : "#ffffff",
        borderRadius: 3,
        boxShadow: muiTheme.shadows[4],
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
      >
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Submission Heatmap
        </Typography>
        <Chip
          label={`Last ${filterDays} Days`}
          variant="filled"
          color="primary"
          size="small"
          sx={{
            fontWeight: 500,
            bgcolor: muiTheme.palette.primary.light,
            color: muiTheme.palette.primary.contrastText,
          }}
        />
      </Box>

      <Divider sx={{ mb: 2, borderColor: muiTheme.palette.divider }} />

      {isLoading && (
        <Box display="flex" justifyContent="center" my={3}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box
        id="cal-heatmap"
        sx={{
          mx: "auto",
          overflowX: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 160,
        }}
      />

      {!isLoading && submissions.length === 0 && !error && (
        <Typography
          align="center"
          color="text.secondary"
          sx={{ mt: 3, fontStyle: "italic" }}
        >
          No submission activity found during this period.
        </Typography>
      )}
    </Paper>
  );
}

SubmissionHeatmap.propTypes = {
  codeforcesHandle: PropTypes.string.isRequired,
  filterDays: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
};

export default SubmissionHeatmap;
