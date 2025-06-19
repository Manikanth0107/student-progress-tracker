import { useState, useContext } from "react";
import PropTypes from "prop-types";
import {
  TextField,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  Grid,
} from "@mui/material";
import { ThemeContext } from "../../context/ThemeContext";

function StudentForm({ student, onClose, onSubmit }) {
  const { theme } = useContext(ThemeContext);
  const [formData, setFormData] = useState({
    name: student?.name || "",
    email: student?.email || "",
    phone: student?.phone || "",
    codeforcesHandle: student?.codeforcesHandle || "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.name) return "Name is required";
    if (!formData.email) return "Email is required";
    if (!formData.codeforcesHandle) return "Codeforces handle is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      return "Invalid email format";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const validationError = validateForm();
      if (validationError) throw new Error(validationError);
      await onSubmit({ id: student?._id, data: formData });
      onClose();
    } catch (err) {
      const msg =
        err.response?.data?.error || err.message || "Failed to save student";
      setError(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Name"
              name="name"
              fullWidth
              required
              value={formData.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              required
              value={formData.email}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Phone"
              name="phone"
              type="tel"
              fullWidth
              value={formData.phone}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Codeforces Handle"
              name="codeforcesHandle"
              fullWidth
              required
              value={formData.codeforcesHandle}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </form>
  );
}

StudentForm.propTypes = {
  student: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    codeforcesHandle: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default StudentForm;
