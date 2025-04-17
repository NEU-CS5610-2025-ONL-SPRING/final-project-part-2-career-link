import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { fetchFormWithAuth, fetchGetWithAuth } from "../../auth/fetchWithAuth";
import { useAuthUser } from "../../auth/authContext";

export default function Resume({ onUploadComplete }) {
  const [file, setFile] = useState(null);
  const [resumeUrl, setResumeUrl] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const { user } = useAuthUser();

  useEffect(() => {
    const fetchResumeUrl = async () => {
      try {
        const data = await fetchGetWithAuth(
          `${process.env.REACT_APP_API_URL}/api/resume/${user.id}`
        );


        if (!data) {
          throw new Error("Failed to fetch resume URL");
        }

        console.log(data);
        if (data.resumeUrl) {
          console.log(data.resumeUrl)
          setResumeUrl(data.resumeUrl);
        }
      } catch (err) {
        console.error("Error fetching resume:", err);
        setError("Failed to fetch resume. Please try again.");
      }
    };

    fetchResumeUrl(); 
  }, [user.id]); 

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setError("");
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a resume file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", user.id);

    try {
      setUploading(true);
      const response = await fetchFormWithAuth(
        `${process.env.REACT_APP_API_URL}/api/resume`,
        formData
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      setResumeUrl(data.resumeUrl);
      setFile(null);
      onUploadComplete && onUploadComplete(data.resumeUrl);
    } catch (err) {
      console.error("Error uploading resume:", err);
      setError("Failed to upload resume. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Card sx={{ maxWidth: 500, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Upload Resume
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadFileIcon />}
            >
              Choose File
              <input type="file" hidden onChange={handleFileChange} accept=".pdf,.doc,.docx" />
            </Button>
            {file && (
              <Typography variant="body2" noWrap>
                {file.name}
              </Typography>
            )}
          </Box>

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <Button
            variant="contained"
            startIcon={<CloudUploadIcon />}
            onClick={handleUpload}
            disabled={uploading || !file}
          >
            {uploading ? "Uploading..." : "Upload"}
          </Button>

          {resumeUrl && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">
                Uploaded Resume:{" "}
                <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                  View Resume
                </a>
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
