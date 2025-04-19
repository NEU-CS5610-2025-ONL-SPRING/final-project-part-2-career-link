import React, { useState, useEffect } from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress } from "@mui/material";
import { fetchGetWithAuth, fetchPostWithAuth, fetchDeleteWithAuth, fetchPutWithAuth } from "../../auth/fetchWithAuth"; // Assuming you have a fetch utility

const JobPostings = () => {
    const [jobPostings, setJobPostings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [newJob, setNewJob] = useState({
        title: "",
        description: "",
        location: "",
        salary: "",
        requirements: ""
    });
    const [editJob, setEditJob] = useState(null); // For editing job posts
    const [errorMessages, setErrorMessages] = useState({
        title: "",
        description: "",
        location: "",
        salary: ""
    });

    // Fetch job postings when component mounts
    useEffect(() => {
        const fetchJobPostings = async () => {
            try {
                setLoading(true);
                const response = await fetchGetWithAuth(`${process.env.REACT_APP_API_URL}/api/jobs?postedBy=current-user`);
                setJobPostings(response);
            } catch (err) {
                setError("Failed to load job postings.");
            } finally {
                setLoading(false);
            }
        };

        fetchJobPostings();
    }, []);

    // Form Validation
    const validateForm = () => {
        let isValid = true;
        const errors = { title: "", description: "", location: "", salary: "" };

        if (!newJob.title) {
            errors.title = "Title is required.";
            isValid = false;
        }
        if (!newJob.description) {
            errors.description = "Description is required.";
            isValid = false;
        }
        if (!newJob.location) {
            errors.location = "Location is required.";
            isValid = false;
        }
        if (newJob.salary && isNaN(newJob.salary)) {
            errors.salary = "Salary must be a number.";
            isValid = false;
        }

        setErrorMessages(errors);
        return isValid;
    };

    // Handle creating a new job posting
    const handleCreateJob = async () => {
        if (!validateForm()) return;

        try {
            const response = await fetchPostWithAuth(`${process.env.REACT_APP_API_URL}/api/jobs`, newJob);
            const jobData = await response.json();

            if (jobData) {
                setJobPostings(prevPostings => [...prevPostings, jobData]);
                setOpenDialog(false);
                setNewJob({ title: "", description: "", location: "", salary: "", requirements: "" });  // Clear form
            }
        } catch (err) {
            setError(err.message || "Failed to create job.");
        }
    };


    // Handle editing an existing job posting
    const handleEditJob = (job) => {
        setEditJob(job);
        setNewJob({
            title: job.title,
            description: job.description,
            location: job.location,
            salary: job.salary,
            requirements: job.requirements,
        });
        setOpenDialog(true);
    };

    // Handle updating the job posting
    const handleUpdateJob = async () => {
        if (!validateForm()) return;

        try {
            const response = await fetchPutWithAuth(`${process.env.REACT_APP_API_URL}/api/jobs/${editJob.id}`, newJob);
            if (response) {
                const updatedJobPostings = jobPostings.map((job) =>
                    job.id === editJob.id ? { ...job, ...newJob } : job
                );
                setJobPostings(updatedJobPostings);
                handleDialogClose();
            }
        } catch (err) {
            setError(err.message || "Failed to update job.");
        }
    };

    // Handle deleting a job posting
    const handleDeleteJob = async (jobId) => {
        try {
            const response = await fetchDeleteWithAuth(`${process.env.REACT_APP_API_URL}/api/jobs/${jobId}`);
            const data = await response.json();
            if (data.message === "Job deleted successfully") {
                setJobPostings(jobPostings.filter((job) => job.id !== jobId));
            } else {
                setError("Failed to delete job.");
            }
        } catch (err) {
            setError("Failed to delete job.");
        }
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        setNewJob({ title: "", description: "", location: "", salary: "", requirements: "" });
        setEditJob(null);
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Typography variant="h6" color="error" align="center">{error}</Typography>;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#3f51b5', fontWeight: 'bold' }}>
                Job Postings
            </Typography>

            <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)} sx={{ mb: 3 }}>
                Post New Job
            </Button>

            {jobPostings.length > 0 ? (
                <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Job Title</TableCell>
                                <TableCell>Location</TableCell>
                                <TableCell>Salary</TableCell>
                                <TableCell>Applications</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {jobPostings.map((job) => (
                                <TableRow key={job.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                                    <TableCell>{job.title}</TableCell>
                                    <TableCell>{job.location}</TableCell>
                                    <TableCell>{job.salary ? `$${job.salary.toLocaleString()}` : "Not specified"}</TableCell>
                                    <TableCell>
                                        <Box sx={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: 24,
                                            height: 24,
                                            borderRadius: '50%',
                                            backgroundColor: 'primary.main',
                                            color: 'white',
                                            fontWeight: 'bold'
                                        }}>
                                            {job.applications?.length || 0}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => handleEditJob(job)}
                                            sx={{ mr: 1 }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() => handleDeleteJob(job.id)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography variant="body1" color="textSecondary" align="center" sx={{ mt: 3 }}>
                    No job postings available.
                </Typography>
            )}

            {/* Post New Job Dialog */}
            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>{editJob ? "Edit Job Posting" : "Post New Job"}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Job Title"
                        fullWidth
                        value={newJob.title || ""}
                        onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                        margin="normal"
                        error={!!errorMessages.title}
                        helperText={errorMessages.title}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Location"
                        fullWidth
                        value={newJob.location || ""}
                        onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                        margin="normal"
                        error={!!errorMessages.location}
                        helperText={errorMessages.location}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Salary"
                        fullWidth
                        value={newJob.salary || ""}
                        onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                        margin="normal"
                        type="number"
                        error={!!errorMessages.salary}
                        helperText={errorMessages.salary}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Job Description"
                        fullWidth
                        value={newJob.description || ""}
                        onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                        margin="normal"
                        multiline
                        rows={4}
                        error={!!errorMessages.description}
                        helperText={errorMessages.description}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Requirements"
                        fullWidth
                        value={newJob.requirements || ""}
                        onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
                        margin="normal"
                        multiline
                        rows={3}
                        sx={{ mb: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">Cancel</Button>
                    <Button
                        onClick={editJob ? handleUpdateJob : handleCreateJob}
                        color="primary"
                        disabled={!newJob.title || !newJob.description || !newJob.location}
                    >
                        {editJob ? "Update Job" : "Post Job"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default JobPostings;
