import React, { useState, useEffect } from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
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

    // Handle creating a new job posting
    const handleCreateJob = async () => {
        try {
            if (!newJob.title || !newJob.description || !newJob.location) {
                throw new Error("Title, description, and location are required.");
            }

            const response = await fetchPostWithAuth(`${process.env.REACT_APP_API_URL}/api/jobs`, newJob);
            if (response) {
                setJobPostings([...jobPostings, response]);
                setOpenDialog(false); // Close the dialog
                setNewJob({ title: "", description: "", location: "", salary: "", requirements: "" }); // Reset the form
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
        try {
            if (!newJob.title || !newJob.description || !newJob.location) {
                throw new Error("Title, description, and location are required.");
            }

            // Wait for the PUT request to complete
            const response = await fetchPutWithAuth(`${process.env.REACT_APP_API_URL}/api/jobs/${editJob.id}`, newJob); // PUT request for update
            if (response) {
                // Update the job in the state after successful update
                const updatedJobPostings = jobPostings.map((job) =>
                    job.id === editJob.id ? { ...job, ...newJob } : job
                );

                // Update state to reflect changes in the table
                setJobPostings(updatedJobPostings);
                handleDialogClose();
            }
        } catch (err) {
            console.error("Error updating job:", err);
            setError(err.message || "Failed to update job.");
        }
    };


    // Handle deleting a job posting
    const handleDeleteJob = async (jobId) => {
        try {
            const response = await fetchDeleteWithAuth(`${process.env.REACT_APP_API_URL}/api/jobs/${jobId}`);
            const data = await response.json(); // Assuming response is JSON
            console.log("Delete response:", data);

            if (data.message === "Job deleted successfully") {
                setJobPostings(jobPostings.filter((job) => job.id !== jobId)); // Remove deleted job from state
            } else {
                setError("Failed to delete job.");
            }
        } catch (err) {
            console.error("Error during deletion:", err);
            setError("Failed to delete job.");
        }
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        setNewJob({ title: "", description: "", location: "", salary: "", requirements: "" });
        setEditJob(null);
    };

    if (loading) {
        return <Typography variant="h6" align="center">Loading job postings...</Typography>;
    }

    if (error) {
        return <Typography variant="h6" color="error" align="center">{error}</Typography>;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Job Postings
            </Typography>

            <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
                Post New Job
            </Button>

            {jobPostings.length > 0 ? (
                <TableContainer component={Paper}>
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
                                <TableRow key={job.id}>
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
                                            onClick={() => handleEditJob(job)} // Edit job
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() => handleDeleteJob(job.id)} // Delete job
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
                        value={newJob.title || ""} // Ensure it's an empty string if the value is null
                        onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        label="Location"
                        fullWidth
                        value={newJob.location || ""} // Ensure it's an empty string if the value is null
                        onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        label="Salary"
                        fullWidth
                        value={newJob.salary || ""} // Ensure it's an empty string if the value is null
                        onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                        margin="normal"
                        type="number"
                    />
                    <TextField
                        label="Job Description"
                        fullWidth
                        value={newJob.description || ""} // Ensure it's an empty string if the value is null
                        onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                        margin="normal"
                        multiline
                        rows={4}
                    />
                    <TextField
                        label="Requirements"
                        fullWidth
                        value={newJob.requirements || ""} // Ensure it's an empty string if the value is null
                        onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
                        margin="normal"
                        multiline
                        rows={3}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">Cancel</Button>
                    <Button onClick={editJob ? handleUpdateJob : handleCreateJob} color="primary">{editJob ? "Update Job" : "Post Job"}</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default JobPostings;
