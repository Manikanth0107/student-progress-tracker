import { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { ThemeContext } from "../../context/ThemeContext";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

function ProblemRatingBarChart({
  codeforcesHandle,
  filterDays,
  setProblemData,
}) {
  const { theme } = useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [analytics, setAnalytics] = useState({});

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      setError("");
      try {
        console.log(
          `Fetching problem analytics for ${codeforcesHandle} (last ${filterDays} days)`
        );
        const res = await axios.get(
          `/api/students/analytics/${codeforcesHandle}?days=${filterDays}`
        );
        setAnalytics(res.data);
        setProblemData(res.data); 
      } catch (err) {
        const errorMessage =
          err.response?.data?.error || "Failed to fetch problem analytics";
        setError(errorMessage);
        console.error("Fetch analytics error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (codeforcesHandle) {
      fetchAnalytics();
    }
  }, [codeforcesHandle, filterDays, setProblemData]);

  const ratingBuckets = analytics.ratingBuckets || [];
  const chartData = {
    labels: ratingBuckets.map(
      (bucket) => `${bucket.rangeStart}-${bucket.rangeEnd}`
    ),
    datasets: [
      {
        label: "Problems Solved",
        data: ratingBuckets.map((bucket) => bucket.count),
        backgroundColor: theme === "dark" ? "#60A5FA" : "#2563EB",
        borderColor: theme === "dark" ? "#93C5FD" : "#BFDBFE",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "top" },
      title: {
        display: true,
        text: `Problems Solved by Rating (Last ${filterDays} Days)`,
      },
    },
    scales: {
      x: { title: { display: true, text: "Rating Range" } },
      y: {
        beginAtZero: true,
        title: { display: true, text: "Number of Problems" },
      },
    },
  };

  if (isLoading) {
    return <div className="text-gray-500 dark:text-gray-400">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 dark:text-red-400">{error}</div>;
  }

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg mt-4">
      <h3 className="text-lg font-semibold mb-2 dark:text-white">
        Problems by Rating
      </h3>
      {ratingBuckets.length > 0 ? (
        <Bar data={chartData} options={chartOptions} />
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-center">
          No problems solved in this period
        </p>
      )}
    </div>
  );
}

ProblemRatingBarChart.propTypes = {
  codeforcesHandle: PropTypes.string.isRequired,
  filterDays: PropTypes.number.isRequired,
  setProblemData: PropTypes.func.isRequired,
};

export default ProblemRatingBarChart;
