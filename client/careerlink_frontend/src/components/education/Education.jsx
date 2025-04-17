import React, { useEffect, useState } from "react";
import {
  fetchGetWithAuth,
  fetchPostWithAuth,
  fetchDeleteWithAuth,
  fetchPutWithAuth,
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

export default function Education() {
  const [education, setEducation] = useState([]);
  const { user } = useAuthUser();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEducationId, setEditingEducationId] = useState(null);
  const [newEducation, setNewEducation] = useState({
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    async function getEducation() {
      try {
        const response = await fetchGetWithAuth(
          `${process.env.REACT_APP_API_URL}/api/education/${user.id}`
        );
        if (response) {
          setEducation(response);
        }
      } catch (error) {
        console.error("Error fetching education data:", error);
      }
    }

    getEducation();
  }, [user]);

  const handleOpenDialog = () => {
    setError("");
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewEducation({
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
    });
    setEditingEducationId(null);
    setError("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEducation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (
      !newEducation.institution ||
      !newEducation.degree ||
      !newEducation.startDate
    ) {
      setError("Institution, Degree, and Start Date are required.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const payload = {
        ...newEducation,
        userId: user.id,
      };

      if (editingEducationId) {
        const response = await fetchPutWithAuth(
          `${process.env.REACT_APP_API_URL}/api/education/${editingEducationId}`,
          payload
        );

        if (response.ok) {
          const updated = await response.json();
          setEducation((prev) =>
            prev.map((edu) => (edu.id === editingEducationId ? updated : edu))
          );
          handleCloseDialog();
        } else {
          console.error("Failed to update education");
        }
      } else {
        const response = await fetchPostWithAuth(
          `${process.env.REACT_APP_API_URL}/api/education`,
          payload
        );

        if (response.ok) {
          const addedEducation = await response.json();
          setEducation((prev) => [...prev, addedEducation]);
          handleCloseDialog();
        } else {
          console.error("Failed to add education");
        }
      }
    } catch (error) {
      console.error("Error submitting education:", error);
    }
  };

  const handleEdit = (edu) => {
    setNewEducation({
      institution: edu.institution,
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy,
      startDate: edu.startDate?.slice(0, 10),
      endDate: edu.endDate?.slice(0, 10) || "",
    });
    setEditingEducationId(edu.id);
    setError("");
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetchDeleteWithAuth(
        `${process.env.REACT_APP_API_URL}/api/education/${id}`
      );

      if (response.ok) {
        setEducation((prev) => prev.filter((edu) => edu.id !== id));
      } else {
        console.error("Failed to delete education");
      }
    } catch (error) {
      console.error("Error deleting education:", error);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Button variant="contained" onClick={handleOpenDialog}>
        Add
      </Button>
      <Grid container spacing={3} sx={{ alignItems: "flex-start", mt: 2 }}>
        {education.map((edu) => (
          <Grid
            item
            key={edu.id}
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
                  {edu.institution}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  {edu.degree}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Field of Study:</strong> {edu.fieldOfStudy || "N/A"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(edu.startDate).toLocaleDateString()} -{" "}
                  {edu.endDate
                    ? new Date(edu.endDate).toLocaleDateString()
                    : "Present"}
                </Typography>
                <IconButton
                  onClick={() => handleEdit(edu)}
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
                  onClick={() => handleDelete(edu.id)}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    color: "red",
                  }}
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
          {editingEducationId ? "Edit Education" : "Add New Education"}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Typography color="error" sx={{ marginBottom: 2 }}>
              {error}
            </Typography>
          )}
          <TextField
            name="institution"
            label="Institution *"
            fullWidth
            value={newEducation.institution}
            onChange={handleInputChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            name="degree"
            label="Degree *"
            fullWidth
            value={newEducation.degree}
            onChange={handleInputChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            name="fieldOfStudy"
            label="Field of Study"
            fullWidth
            value={newEducation.fieldOfStudy}
            onChange={handleInputChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            name="startDate"
            label="Start Date *"
            type="date"
            fullWidth
            value={newEducation.startDate}
            onChange={handleInputChange}
            sx={{ marginBottom: 2 }}
            InputLabelProps={{ shrink: true }}
            inputProps={{
              max: new Date().toISOString().split("T")[0],
            }}
          />
          <TextField
            name="endDate"
            label="End Date"
            type="date"
            fullWidth
            value={newEducation.endDate}
            onChange={handleInputChange}
            sx={{ marginBottom: 2 }}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {editingEducationId ? "Update" : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
