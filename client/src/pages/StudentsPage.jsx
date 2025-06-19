import { Box, Container, Typography, Paper } from "@mui/material";
import StudentTable from "../components/student/StudentTable";

function StudentsPage() {
  return (
    <Container maxWidth="lg" sx={{ mt: 10 }}>
      <Box mb={3}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Students Overview
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Manage student records, activity, and submissions here.
        </Typography>
      </Box>

      <Paper elevation={4} sx={{ p: 3 }}>
        <StudentTable />
      </Paper>
    </Container>
  );
}

export default StudentsPage;
