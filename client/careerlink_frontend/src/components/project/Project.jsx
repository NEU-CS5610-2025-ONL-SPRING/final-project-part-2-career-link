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

export default function Project() {
  const [projects, setProjects] = useState([]);
  const { user } = useAuthUser();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    technologies: "",
    projectUrl: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    async function getProjects() {
      try {
        const response = await fetchGetWithAuth(
          `${process.env.REACT_APP_API_URL}/api/projects/${user.id}`
        );
        if (response) setProjects(response.projects || []);
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    }

    getProjects();
  }, [user]);

  const handleOpenDialog = () => {
    setError("");
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingId(null);
    setError("");
    setNewProject({
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      technologies: "",
      projectUrl: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!newProject.title || !newProject.description) {
      setError("Title and Description are required.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      const payload = { ...newProject, userId: user.id };

      if (editingId) {
        const response = await fetchPutWithAuth(
          `${process.env.REACT_APP_API_URL}/api/projects/${editingId}`,
          payload
        );
        if (response.ok) {
          const updated = await response.json();
          setProjects((prev) =>
            prev.map((proj) => (proj.id === editingId ? updated : proj))
          );
          handleCloseDialog();
        } else {
          console.error("Failed to update project");
        }
      } else {
        const response = await fetchPostWithAuth(
          `${process.env.REACT_APP_API_URL}/api/projects`,
          payload
        );
        if (response.ok) {
          const added = await response.json();
          setProjects((prev) => [...prev, added]);
          handleCloseDialog();
        } else {
          console.error("Failed to add project");
        }
      }
    } catch (error) {
      console.error("Error submitting project:", error);
    }
  };

  const handleEdit = (proj) => {
    setNewProject({
      title: proj.title,
      description: proj.description,
      startDate: proj.startDate?.slice(0, 10),
      endDate: proj.endDate?.slice(0, 10) || "",
      technologies: proj.technologies || "",
      projectUrl: proj.projectUrl || "",
    });
    setEditingId(proj.id);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetchDeleteWithAuth(
        `${process.env.REACT_APP_API_URL}/api/projects/${id}`
      );
      if (response.ok) {
        setProjects((prev) => prev.filter((proj) => proj.id !== id));
      } else {
        console.error("Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Button variant="contained" onClick={handleOpenDialog}>
        Add
      </Button>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {projects.map((proj) => (
          <Grid
            item
            key={proj.id}
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
                  {proj.title}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  {new Date(proj.startDate).toLocaleDateString()} -{" "}
                  {proj.endDate
                    ? new Date(proj.endDate).toLocaleDateString()
                    : "Present"}
                </Typography>
                {proj.technologies && (
                  <Typography variant="body2" color="text.secondary">
                    Tech: {proj.technologies}
                  </Typography>
                )}
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {proj.description}
                </Typography>
                {proj.projectUrl && (
                  <Typography
                    variant="body2"
                    sx={{ mt: 1 }}
                    component="a"
                    href={
                      proj.projectUrl.startsWith("http://") || proj.projectUrl.startsWith("https://")
                        ? proj.projectUrl
                        : `https://${proj.projectUrl}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    🔗 Project Link
                  </Typography>
                )}
                <IconButton
                  onClick={() => handleEdit(proj)}
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
                  onClick={() => handleDelete(proj.id)}
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
        <DialogTitle>{editingId ? "Edit Project" : "Add New Project"}</DialogTitle>
        <DialogContent>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <TextField
            name="title"
            label="Title *"
            fullWidth
            value={newProject.title}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            name="startDate"
            label="Start Date"
            type="date"
            fullWidth
            value={newProject.startDate}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
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
            value={newProject.endDate}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            name="technologies"
            label="Technologies Used"
            fullWidth
            value={newProject.technologies}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            name="projectUrl"
            label="Project URL"
            fullWidth
            value={newProject.projectUrl}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            name="description"
            label="Description *"
            fullWidth
            multiline
            minRows={3}
            value={newProject.description}
            onChange={handleInputChange}
            inputProps={{ maxLength: 255 }}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit}>
            {editingId ? "Update" : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
