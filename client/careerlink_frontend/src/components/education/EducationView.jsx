import React, { useEffect, useState } from "react";
import { fetchGetWithAuth } from "../../auth/fetchWithAuth";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box
} from "@mui/material";

export default function EducationView({ employeeUserId }) {
  const [education, setEducation] = useState([]);

  useEffect(() => {
    async function getEducation() {
      try {
        const response = await fetchGetWithAuth(
          `${process.env.REACT_APP_API_URL}/api/education/${employeeUserId}`
        );
        if (response) {
          setEducation(response);
        }
      } catch (error) {
        console.error("Error fetching education data:", error);
      }
    }

    if (employeeUserId) {
      getEducation();
    }
  }, [employeeUserId]);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        Education
      </Typography>
      <Grid container spacing={3} sx={{ alignItems: "flex-start", mt: 1 }}>
        {education.map((edu) => (
          <Grid
            item
            key={edu.id}
            sx={{ flex: "1 1 320px", maxWidth: "400px", display: "flex" }}
          >
            <Card
              sx={{
                width: "100%",
                minHeight: 180,
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
    </Box>
  );
}
