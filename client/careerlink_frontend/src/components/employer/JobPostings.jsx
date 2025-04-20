import React, { useState, useEffect } from "react";
import {
    Box, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions,
    DialogContent, DialogTitle, CircularProgress, Snackbar, Alert,
    Grid, Divider, IconButton
} from "@mui/material";

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';

import {
    fetchGetWithAuth,
    fetchPostWithAuth,
    fetchPutWithAuth,
    fetchDeleteWithAuth
} from "../../auth/fetchWithAuth"; // Adjust path as needed

const JobPostings = () => {
    const [jobPostings, setJobPostings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [editJob, setEditJob] = useState(null);
    const [newJob, setNewJob] = useState({
        title: "", description: "", location: "", salary: "", requirements: ""
    });
    const [errorMessages, setErrorMessages] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await fetchGetWithAuth(`${process.env.REACT_APP_API_URL}/api/jobs?postedBy=current-user`);
                setJobPostings(response);
            } catch (err) {
                setError("Failed to load job postings.");
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const validateForm = () => {
        let valid = true;
        const errors = {};
        if (!newJob.title) { errors.title = "Title is required."; valid = false; }
        if (!newJob.description) { errors.description = "Description is required."; valid = false; }
        if (!newJob.location) { errors.location = "Location is required."; valid = false; }
        if (newJob.salary && isNaN(newJob.salary)) { errors.salary = "Salary must be a number."; valid = false; }
        setErrorMessages(errors);
        return valid;
    };

    const handleCreateOrUpdate = async () => {
        if (!validateForm()) return;

        const apiCall = editJob
            ? fetchPutWithAuth(`${process.env.REACT_APP_API_URL}/api/jobs/${editJob.id}`, newJob)
            : fetchPostWithAuth(`${process.env.REACT_APP_API_URL}/api/jobs`, newJob);

        try {
            const response = await apiCall;
            const jobData = await response.json();

            if (editJob) {
                setJobPostings(prev =>
                    prev.map(job => job.id === editJob.id ? { ...job, ...newJob } : job));
            } else {
                setJobPostings(prev => [...prev, jobData]);
            }

            setOpenDialog(false);
            setEditJob(null);
            setNewJob({ title: "", description: "", location: "", salary: "", requirements: "" });
            setSnackbarOpen(true);
        } catch (err) {
            setError("Failed to save job.");
        }
    };

    const handleEditJob = (job) => {
        setEditJob(job);
        setNewJob(job);
        setOpenDialog(true);
    };

    const handleDeleteJob = async (id) => {
        try {
            const res = await fetchDeleteWithAuth(`${process.env.REACT_APP_API_URL}/api/jobs/${id}`);
            const data = await res.json();
            if (data.message === "Job deleted successfully") {
                setJobPostings(jobs => jobs.filter(j => j.id !== id));
            }
        } catch {
            setError("Failed to delete job.");
        }
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        setEditJob(null);
        setNewJob({ title: "", description: "", location: "", salary: "", requirements: "" });
        setErrorMessages({});
    };

    return (
        <Box sx={{ p: { xs: 2, sm: 4 } }}>
            <Typography
                variant="h4"
                sx={{
                    fontWeight: 700,
                    color: "primary.main",
                    textAlign: "center",
                    mb: 2,
                    fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" }, // Responsive font size
                    background: "linear-gradient(45deg, #2A4D8C, #D24F75)",  // Gradient background
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                    textTransform: "uppercase"  // Uppercase for a sleek modern look
                }}
            >
                Job Postings
            </Typography>

            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenDialog(true)}
                sx={{ mb: 3 }}
            >
                Post New Job
            </Button>

            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
                    <CircularProgress />
                </Box>
            ) : jobPostings.length > 0 ? (
                <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                    <Table>
                        <TableHead sx={{ backgroundColor: "#f4f6fa" }}>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell>Location</TableCell>
                                <TableCell>Salary</TableCell>
                                <TableCell>Applications</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {jobPostings.map((job) => (
                                !job.isDeleted && (
                                    <TableRow key={job.id} hover>
                                        <TableCell>{job.title}</TableCell>
                                        <TableCell>{job.location}</TableCell>
                                        <TableCell>{job.salary ? `$${parseInt(job.salary).toLocaleString()}` : "N/A"}</TableCell>
                                        <TableCell>
                                            <Button
                                                size="small"
                                                onClick={() => window.open(`/employer/applications?jobId=${job.id}`, '_blank')}
                                            >
                                                View
                                            </Button>
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton onClick={() => handleEditJob(job)} color="primary">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDeleteJob(job.id)} color="error">
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                )
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Box sx={{ textAlign: "center", mt: 6, color: "text.secondary" }}>
                    <WorkOutlineIcon sx={{ fontSize: 60, mb: 2, color: "text.disabled" }} />
                    <Typography variant="h6">No job postings yet</Typography>
                    <Typography variant="body2">Click “Post New Job” to get started</Typography>
                </Box>
            )}

            {/* Dialog */}
            <Dialog
                open={openDialog}
                onClose={handleDialogClose}
                maxWidth="md"  // Increase max width for larger screens
                fullWidth
                sx={{ padding: { xs: 2, sm: 3 } }}  // Responsive padding
            >
                <DialogTitle
                    sx={{
                        fontSize: { xs: "1.5rem", sm: "1.8rem" },
                        fontWeight: 600,
                        textAlign: "center",
                        color: "primary.main"
                    }}
                >
                    {editJob ? "Edit Job Posting" : "Post New Job"}
                </DialogTitle>
                <Divider sx={{ mb: 2 }} />

                <DialogContent sx={{ padding: { xs: 3, sm: 4 } }}>
                    {/* Form fields in a single column */}
                    <TextField
                        label="Job Title"
                        fullWidth
                        value={newJob.title}
                        onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                        margin="normal"
                        error={!!errorMessages.title}
                        helperText={errorMessages.title}
                        sx={{ mb: 3 }}  // Spacing between fields
                    />

                    <TextField
                        label="Location"
                        fullWidth
                        value={newJob.location}
                        onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                        margin="normal"
                        error={!!errorMessages.location}
                        helperText={errorMessages.location}
                        sx={{ mb: 3 }}  // Spacing between fields
                    />

                    <TextField
                        label="Salary"
                        fullWidth
                        value={newJob.salary}
                        onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                        margin="normal"
                        type="number"
                        error={!!errorMessages.salary}
                        helperText={errorMessages.salary}
                        sx={{ mb: 3 }}  // Spacing between fields
                    />

                    <TextField
                        label="Job Description"
                        fullWidth
                        value={newJob.description}
                        onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                        margin="normal"
                        multiline
                        rows={4}
                        error={!!errorMessages.description}
                        helperText={errorMessages.description}
                        sx={{ mb: 3 }}  // Spacing between fields
                    />

                    <TextField
                        label="Requirements"
                        fullWidth
                        value={newJob.requirements}
                        onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
                        margin="normal"
                        multiline
                        rows={3}
                        sx={{ mb: 3 }}  // Spacing between fields
                    />
                </DialogContent>

                {/* Dialog Actions */}
                <DialogActions sx={{ padding: { xs: 2, sm: 3 } }}>
                    <Button onClick={handleDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCreateOrUpdate}
                        color="primary"
                        variant="contained"
                        disabled={!newJob.title || !newJob.description || !newJob.location}
                    >
                        {editJob ? "Update Job" : "Post Job"}
                    </Button>
                </DialogActions>
            </Dialog>



            {/* Snackbar */}
            <Snackbar open={snackbarOpen} autoHideDuration={5000} onClose={() => setSnackbarOpen(false)}>
                <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
                    {editJob ? "Job updated successfully!" : "Job posted successfully!"}
                </Alert>
            </Snackbar>

            {/* Error Snackbar */}
            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
                <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default JobPostings;
