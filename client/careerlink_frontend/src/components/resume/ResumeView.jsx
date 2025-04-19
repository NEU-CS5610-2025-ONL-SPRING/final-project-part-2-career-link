import React, { useState, useEffect } from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import { fetchGetWithAuth } from "../../auth/fetchWithAuth";

export default function ResumeView({ employeeUserId }) {
  const [resumeUrl, setResumeUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResumeUrl = async () => {
      try {
        const data = await fetchGetWithAuth(
          `${process.env.REACT_APP_API_URL}/api/resume/${employeeUserId}`
        );
        if (data?.resumeUrl) {
          setResumeUrl(data.resumeUrl);
        }
      } catch (err) {
        console.error("Error fetching resume:", err);
        setError("❌ Failed to fetch resume. Please try again later.");
      }
    };

    if (employeeUserId) {
      fetchResumeUrl();
    }
  }, [employeeUserId]);

  return (
    <Box sx={{ padding: 3 }}>
      <Card sx={{ maxWidth: 500, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Resume
          </Typography>

          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}

          {resumeUrl ? (
            <Typography variant="body2">
              Uploaded Resume:{" "}
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                View Resume
              </a>
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No resume uploaded.
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
