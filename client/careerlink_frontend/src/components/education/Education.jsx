import React, { useEffect, useState } from "react";
import { fetchGetWithAuth } from "../../auth/fetchWithAuth";
import { Card, CardContent, Typography, Grid, Box } from "@mui/material";

export default function Education() {
  const [education, setEducation] = useState(
  );

  useEffect(() => {
    async function getEducation() {
      try {
        const response = await fetchGetWithAuth(`${process.env.REACT_APP_API_URL}/api/education`);

        if (response.ok) {
          const edu = await response.json();
          setEducation((prevEducation) => [...prevEducation, ...edu]);
        }
      } catch (error) {
        console.error("Error fetching education data:", error);
      }
    }

    getEducation();
  }, []);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Education
      </Typography>
      <Grid container spacing={3}>
        {education.map((edu, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ minHeight: 200 }}>
              <CardContent>
                <Typography variant="h6" component="div">
                  {edu.institution}
                </Typography>
                <Typography color="text.secondary">
                  {edu.degree}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Field of Study: {edu.fieldOfStudy || "N/A"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Start Date: {new Date(edu.startDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  End Date: {edu.endDate ? new Date(edu.endDate).toLocaleDateString() : "Present"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
