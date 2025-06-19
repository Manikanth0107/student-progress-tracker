import { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";
import { ThemeContext } from "../../context/ThemeContext";

function SyncSettings() {
  const { theme } = useContext(ThemeContext);
  const [syncEnabled, setSyncEnabled] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    axios
      .get("/api/settings/sync")
      .then((res) => setSyncEnabled(res.data.enabled))
      .catch(() => setError("Failed to fetch sync settings"));
  }, []);

  const handleManualSync = async () => {
    setIsSyncing(true);
    setError("");
    setSuccess("");
    try {
      await axios.post("/api/codeforces/sync");
      setSuccess("Manual sync completed successfully");
    } catch {
      setError("Failed to perform manual sync");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleToggleSync = async () => {
    setError("");
    setSuccess("");
    try {
      await axios.put("/api/settings/sync", { enabled: !syncEnabled });
      setSyncEnabled((prev) => !prev);
      setSuccess("Sync settings updated");
    } catch {
      setError("Failed to update sync settings");
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h6" gutterBottom>
        Codeforces Sync Settings
      </Typography>

      <FormControlLabel
        control={
          <Switch
            checked={syncEnabled}
            onChange={handleToggleSync}
            color="primary"
          />
        }
        label="Enable Automatic Codeforces Sync"
      />
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        When enabled, student data is synced daily at 2 AM (configurable in the
        Cron Job Manager).
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleManualSync}
          disabled={isSyncing}
          startIcon={isSyncing && <CircularProgress size={18} />}
        >
          {isSyncing ? "Syncing..." : "Run Manual Sync"}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
    </Paper>
  );
}

export default SyncSettings;
