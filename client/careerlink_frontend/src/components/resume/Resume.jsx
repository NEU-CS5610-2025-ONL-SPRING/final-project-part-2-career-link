import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { CircularProgress } from "@mui/material";

import UploadFileIcon from "@mui/icons-material/UploadFile";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { fetchFormWithAuth, fetchGetWithAuth } from "../../auth/fetchWithAuth";
import { useAuthUser } from "../../auth/authContext";

export default function Resume({ onUploadComplete }) {
  const [file, setFile] = useState(null);
  const [resumeUrl, setResumeUrl] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [loadingReview, setLoadingReview] = useState(false);

  const { user } = useAuthUser();

  useEffect(() => {
    const fetchResumeUrl = async () => {
      try {
        const data = await fetchGetWithAuth(
          `${process.env.REACT_APP_API_URL}/api/resume/${user.id}`
        );
        if (data?.resumeUrl) {
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

      if (!response.ok) throw new Error("Upload failed");

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

  const handleAnalyzeResume = async () => {
    try {
      setError("");
      setReviewText(""); 
      setLoadingReview(true);
      setOpenReviewDialog(true); 
  
      const data = await fetchGetWithAuth(
        `${process.env.REACT_APP_API_URL}/api/resume/analyze/${user.id}`
      );
  
      if (!data) throw new Error("Failed to analyze resume");
  
      const cleaned = data.review
        .replace(/\*\*(.*?)\*\*/g, "$1") // bold
        .replace(/\*(.*?)\*/g, "$1") // italics
        .replace(/`{1,3}(.*?)`{1,3}/g, "$1") // inline code
        .replace(/^### (.*$)/gim, "$1") // headers
        .replace(/^## (.*$)/gim, "$1")
        .replace(/^# (.*$)/gim, "$1")
        .replace(/>\s?(.*)/g, "$1") // blockquotes
        .replace(/[-*+] +/g, "• ") // unordered list
        .replace(/\n{2,}/g, "\n\n") // spacing
        .trim();
  
      setReviewText(cleaned);
    } catch (err) {
      console.error("AI Resume Analysis Error:", err);
      setReviewText("❌ Could not analyze resume. Try again later.");
    } finally {
      setLoadingReview(false);
    }
  };
  

  const handleCloseReviewDialog = () => {
    setOpenReviewDialog(false);
    setReviewText("");
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
              <input
                type="file"
                hidden
                onChange={handleFileChange}
                accept=".pdf"
              />
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
              <Button
                variant="contained"
                color="secondary"
                onClick={handleAnalyzeResume}
              >
                🔍 Analyze Resume using AI
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={openReviewDialog}
        onClose={handleCloseReviewDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>🧠 AI Resume Feedback</DialogTitle>
        <DialogContent dividers>
          {loadingReview ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
              {reviewText}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReviewDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
