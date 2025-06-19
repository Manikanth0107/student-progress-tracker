import { Container, Typography, Button, Box, Paper } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

function NotFoundPage() {
  return (
    <Container
      maxWidth="sm"
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h3" gutterBottom>
          404 - Page Not Found
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Sorry, the page you are looking for does not exist.
        </Typography>
        <Button
          component={RouterLink}
          to="/"
          variant="contained"
          color="primary"
        >
          Go to Home
        </Button>
      </Paper>
    </Container>
  );
}

export default NotFoundPage;
