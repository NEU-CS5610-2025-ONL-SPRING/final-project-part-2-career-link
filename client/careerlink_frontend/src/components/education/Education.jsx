import React, { useEffect, useState } from "react";
import { fetchGetWithAuth, fetchPostWithAuth } from "../../auth/fetchWithAuth";
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
} from "@mui/material";
import { useAuthUser } from "../../auth/authContext";

export default function Education() {
  const [education, setEducation] = useState([]);
  const { user } = useAuthUser();
  const [openDialog, setOpenDialog] = useState(false); // State to control Dialog visibility
  const [newEducation, setNewEducation] = useState({
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    async function getEducation() {
      try {
        const response = await fetchGetWithAuth(
          `${process.env.REACT_APP_API_URL}/api/education/` + user.id
        );

        if (response) {
          setEducation((prevEducation) => [...prevEducation, ...response]);
        }
      } catch (error) {
        console.error("Error fetching education data:", error);
      }
    }

    getEducation();
  }, [user]);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEducation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetchPostWithAuth(
        `${process.env.REACT_APP_API_URL}/api/education`, 
        {
          ...newEducation,
          userId: user.id,
        }
      );

      if (response.ok) {
        const addedEducation = await response.json();
        setEducation((prev) => [...prev, addedEducation]);
        handleCloseDialog();
      } else {
        console.error("Failed to add education");
      }
    } catch (error) {
      console.error("Error adding education:", error);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Button onClick={handleOpenDialog}>Add</Button>
      <Grid container spacing={3} sx={{ alignItems: "flex-start" }}>
        {education.map((edu, index) => (
          <Grid
            key={index}
            sx={{
              flex: "1 1 320px",
              maxWidth: "400px",
              display: "flex",
            }}
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
              <CardContent sx={{ textAlign: "left" }}>
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
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add New Education</DialogTitle>
        <DialogContent>
          <TextField
            name="institution"
            label="Institution"
            fullWidth
            value={newEducation.institution}
            onChange={handleInputChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            name="degree"
            label="Degree"
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
            label="Start Date"
            type="date"
            fullWidth
            value={newEducation.startDate}
            onChange={handleInputChange}
            sx={{ marginBottom: 2 }}
            InputLabelProps={{
              shrink: true,
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
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
