import React, { useEffect, useState } from "react";
import { fetchGetWithAuth } from "../../auth/fetchWithAuth";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box
} from "@mui/material";

export default function ProjectView({ employeeUserId }) {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    async function getProjects() {
      try {
        const response = await fetchGetWithAuth(
          `${process.env.REACT_APP_API_URL}/api/projects/${employeeUserId}`
        );
        if (response) setProjects(response.projects || []);
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    }

    if (employeeUserId) {
      getProjects();
    }
  }, [employeeUserId]);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        Projects
      </Typography>
      <Grid container spacing={3} sx={{ mt: 1 }}>
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
              <CardContent sx={{ textAlign: "left" }}>
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
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
