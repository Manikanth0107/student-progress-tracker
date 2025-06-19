import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Paper,
} from "@mui/material";

function CronJobManager() {
  const [cronSchedule, setCronSchedule] = useState("0 2 * * *");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("/api/settings/cron")
      .then((res) => setCronSchedule(res.data.schedule))
      .catch(() => setError("Failed to fetch cron schedule"));
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    setError("");
    try {
      await axios.put("/api/settings/cron", { schedule: cronSchedule });
      alert("Cron schedule updated successfully");
    } catch (err) {
      setError("Failed to update cron schedule");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h6" gutterBottom>
        Cron Job Manager
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Cron Schedule
      </Typography>

      <TextField
        fullWidth
        label="Cron Expression"
        variant="outlined"
        value={cronSchedule}
        onChange={(e) => setCronSchedule(e.target.value)}
        placeholder="Enter cron expression"
        sx={{ mb: 2 }}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={isLoading}
          startIcon={isLoading && <CircularProgress size={18} />}
        >
          {isLoading ? "Saving..." : "Save Schedule"}
        </Button>
      </Box>
    </Paper>
  );
}

export default CronJobManager;
