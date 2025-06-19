import PropTypes from "prop-types";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { Box, Typography, Paper } from "@mui/material";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import "chartjs-adapter-date-fns";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  Legend
);

function RatingChart({ contestData, filterDays }) {
  const { theme } = useContext(ThemeContext);

  const safeContestData = Array.isArray(contestData) ? contestData : [];

  const chartData = {
    labels: safeContestData.map(
      (c) => new Date(c.ratingUpdateTimeSeconds * 1000)
    ),
    datasets: [
      {
        label: "Rating",
        data: safeContestData.map((c) => c.newRating),
        borderColor: theme === "dark" ? "#90CAF9" : "#1976D2",
        backgroundColor: theme === "dark" ? "#E3F2FD" : "#BBDEFB",
        fill: false,
        tension: 0.1,
        pointRadius: 3,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "top" },
      title: {
        display: true,
        text: `Rating History (Last ${filterDays} Days)`,
      },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: (context) => `Rating: ${context.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "month",
          tooltipFormat: "PPP",
        },
        title: {
          display: true,
          text: "Date",
        },
        grid: {
          color: "#e0e0e0",
        },
      },
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: "Rating",
        },
        grid: {
          color: "#e0e0e0",
        },
      },
    },
  };

  console.log("contestData:", contestData);
  console.log("Chart Labels:", chartData.labels);
  console.log("Chart Ratings:", chartData.datasets[0].data);

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Rating Trend
      </Typography>

      {safeContestData.length > 0 ? (
        <Line data={chartData} options={chartOptions} />
      ) : (
        <Typography align="center" color="text.secondary">
          No contest data found.
        </Typography>
      )}
    </Paper>
  );
}

RatingChart.propTypes = {
  contestData: PropTypes.array.isRequired,
  filterDays: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
};

export default RatingChart;
