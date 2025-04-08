import React, { useEffect, useState } from "react";
import {
  fetchGetWithAuth,
  fetchPostWithAuth,
  fetchPutWithAuth,
  fetchDeleteWithAuth,
} from "../../auth/fetchWithAuth";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useAuthUser } from "../../auth/authContext";

export default function Experience() {
  const [experiences, setExperiences] = useState([]);
  const { user } = useAuthUser();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newExperience, setNewExperience] = useState({
    company: "",
    jobTitle: "",
    startDate: "",
    endDate: "",
    description: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    async function getExperience() {
      try {
        const response = await fetchGetWithAuth(
          `${process.env.REACT_APP_API_URL}/api/experience/${user.id}`
        );
        if (response) setExperiences(response);
      } catch (error) {
        console.error("Error fetching experience data:", error);
      }
    }

    getExperience();
  }, [user]);

  const handleOpenDialog = () => {
    setError("");
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingId(null);
    setError("");
    setNewExperience({
      company: "",
      jobTitle: "",
      startDate: "",
      endDate: "",
      description: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExperience((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (
      !newExperience.company ||
      !newExperience.jobTitle ||
      !newExperience.startDate
    ) {
      setError("Company, Job Title, and Start Date are required.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      const payload = { ...newExperience, userId: user.id };

      if (editingId) {
        const response = await fetchPutWithAuth(
          `${process.env.REACT_APP_API_URL}/api/experience/${editingId}`,
          payload
        );
        if (response.ok) {
          const updated = await response.json();
          setExperiences((prev) =>
            prev.map((exp) => (exp.id === editingId ? updated : exp))
          );
          handleCloseDialog();
        } else {
          console.error("Failed to update experience");
        }
      } else {
        const response = await fetchPostWithAuth(
          `${process.env.REACT_APP_API_URL}/api/experience`,
          payload
        );
        if (response.ok) {
          const added = await response.json();
          setExperiences((prev) => [...prev, added]);
          handleCloseDialog();
        } else {
          console.error("Failed to add experience");
        }
      }
    } catch (error) {
      console.error("Error submitting experience:", error);
    }
  };

  const handleEdit = (exp) => {
    setNewExperience({
      company: exp.company,
      jobTitle: exp.jobTitle,
      startDate: exp.startDate?.slice(0, 10),
      endDate: exp.endDate?.slice(0, 10) || "",
      description: exp.description || "",
    });
    setEditingId(exp.id);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetchDeleteWithAuth(
        `${process.env.REACT_APP_API_URL}/api/experience/${id}`
      );
      if (response.ok) {
        setExperiences((prev) => prev.filter((exp) => exp.id !== id));
      } else {
        console.error("Failed to delete experience");
      }
    } catch (error) {
      console.error("Error deleting experience:", error);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Button variant="contained" onClick={handleOpenDialog}>
        Add
      </Button>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {experiences.map((exp) => (
          <Grid
            item
            key={exp.id}
            sx={{ flex: "1 1 320px", maxWidth: "400px", display: "flex" }}
          >
            <Card
              sx={{
                width: "100%",
                minHeight: 220,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: 3,
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 6,
                },
              }}
            >
              <CardContent sx={{ textAlign: "left", position: "relative" }}>
                <Typography variant="h6" gutterBottom>
                  {exp.company}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  {exp.jobTitle}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(exp.startDate).toLocaleDateString()} -{" "}
                  {exp.endDate
                    ? new Date(exp.endDate).toLocaleDateString()
                    : "Present"}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {exp.description || "No description"}
                </Typography>
                <IconButton
                  onClick={() => handleEdit(exp)}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 44,
                    color: "blue",
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleDelete(exp.id)}
                  sx={{ position: "absolute", top: 8, right: 8, color: "red" }}
                >
                  <DeleteIcon />
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {editingId ? "Edit Experience" : "Add New Experience"}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <TextField
            name="company"
            label="Company *"
            fullWidth
            value={newExperience.company}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            name="jobTitle"
            label="Job Title *"
            fullWidth
            value={newExperience.jobTitle}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            name="startDate"
            label="Start Date *"
            type="date"
            fullWidth
            value={newExperience.startDate}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            name="endDate"
            label="End Date"
            type="date"
            fullWidth
            value={newExperience.endDate}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <Typography
            variant="caption"
            color="textSecondary"
            align="right"
            sx={{ mb: 1 }}
          >
            {newExperience.description.length}/255
          </Typography>
          <TextField
            name="description"
            label="Description"
            fullWidth
            multiline
            minRows={3}
            value={newExperience.description}
            onChange={handleInputChange}
            inputProps={{ maxLength: 255 }}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {editingId ? "Update" : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
