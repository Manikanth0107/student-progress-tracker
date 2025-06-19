import { useState } from "react";
import {
  Container,
  Typography,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  Sync as SyncIcon,
} from "@mui/icons-material";

import { Link } from "react-router-dom";
import useStudents from "../../hooks/useStudents";
import { exportToCSV } from "../../utils/csvExport";
import StudentForm from "./StudentForm";
import ConfirmDialog from "../common/ConfirmDialog";
import axios from "axios";

function StudentTable() {
  const {
    students,
    isLoading,
    error,
    addStudent,
    updateStudent,
    deleteStudent,
    fetchStudents,
  } = useStudents();

  const [showForm, setShowForm] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formError, setFormError] = useState("");

  const handleExport = () => exportToCSV(students, "students.csv");

  const handleDelete = async () => {
    try {
      await deleteStudent({ id: deleteId });
      setDeleteId(null);
    } catch (err) {
      setFormError(err.message || "Failed to delete student");
    }
  };

  const handleSubmit = async ({ id, data }) => {
    try {
      if (!data) throw new Error("Form data is missing");
      id ? await updateStudent({ id, data }) : await addStudent({ data });
      setFormError("");
    } catch (err) {
      setFormError(err.message || "Failed to save student");
      throw err;
    }
  };

  const handleSyncRatings = async () => {
    try {
      await axios.post("/api/students/sync-ratings");
      await fetchStudents();
      setFormError("");
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to sync ratings";
      setFormError(msg);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        sx={{ mb: 3 }}
      >
        <Typography variant="h5" fontWeight="bold">
          Student Records
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setShowForm(true)}
          >
            Add Student
          </Button>
          <Button
            variant="outlined"
            color="success"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
          >
            Export CSV
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<SyncIcon />}
            onClick={handleSyncRatings}
          >
            Sync Ratings
          </Button>
        </Stack>
      </Stack>

      {formError && (
        <Typography color="error" sx={{ mb: 2 }}>
          {formError}
        </Typography>
      )}
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {isLoading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>CF Handle</TableCell>
                <TableCell>Current Rating</TableCell>
                <TableCell>Max Rating</TableCell>
                <TableCell>Last Updated</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student._id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.phone || "-"}</TableCell>
                  <TableCell>{student.codeforcesHandle}</TableCell>
                  <TableCell>{student.currentRating || "N/A"}</TableCell>
                  <TableCell>{student.maxRating || "N/A"}</TableCell>
                  <TableCell>
                    {new Date(student.lastUpdated).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      component={Link}
                      to={`/students/${student._id}`}
                      size="small"
                      color="primary"
                    >
                      <ViewIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="warning"
                      onClick={() => {
                        setEditStudent(student);
                        setShowForm(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => setDeleteId(student._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

     
      <Dialog open={showForm} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editStudent ? "Edit Student" : "Add Student"}
        </DialogTitle>
        <DialogContent dividers>
          <StudentForm
            student={editStudent}
            onSubmit={handleSubmit}
            onClose={() => {
              setShowForm(false);
              setEditStudent(null);
              setFormError("");
            }}
          />
        </DialogContent>
      </Dialog>

      
      {deleteId && (
        <ConfirmDialog
          message="Are you sure you want to delete this student?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </Container>
  );
}

export default StudentTable;
