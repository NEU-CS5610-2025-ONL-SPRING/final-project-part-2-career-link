import React, { useEffect, useState } from "react";
import { fetchGetWithAuth } from "../../auth/fetchWithAuth";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box
} from "@mui/material";

export default function ExperienceView({ employeeUserId }) {
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    async function getExperience() {
      try {
        const response = await fetchGetWithAuth(
          `${process.env.REACT_APP_API_URL}/api/experience/${employeeUserId}`
        );
        if (response) setExperiences(response);
      } catch (error) {
        console.error("Error fetching experience data:", error);
      }
    }

    if (employeeUserId) {
      getExperience();
    }
  }, [employeeUserId]);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        Work Experience
      </Typography>
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {experiences.map((exp) => (
          <Grid
            item
            key={exp.id}
            sx={{ flex: "1 1 320px", maxWidth: "400px", display: "flex" }}
          >
            <Card
              sx={{
                width: "100%",
                minHeight: 200,
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
                  {exp.description || "No description provided."}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
