import { useState } from "react";
import { Container, Typography, Tabs, Tab, Box, Paper } from "@mui/material";
import SyncSettings from "../components/settings/SyncSettings";
import EmailSettings from "../components/settings/EmailSettings";
import CronJobManager from "../components/settings/CronJobManager";

function SettingsPage() {
  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 10 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Paper square sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Sync Settings" />
          <Tab label="Email Settings" />
          <Tab label="Cron Job Manager" />
        </Tabs>
      </Paper>

      <Box>
        {activeTab === 0 && <SyncSettings />}
        {activeTab === 1 && <EmailSettings />}
        {activeTab === 2 && <CronJobManager />}
      </Box>
    </Container>
  );
}

export default SettingsPage;
