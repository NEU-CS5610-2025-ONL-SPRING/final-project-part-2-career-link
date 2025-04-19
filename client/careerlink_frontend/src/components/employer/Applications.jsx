import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // Import to use location hook
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, FormControl, InputLabel, Button } from "@mui/material";
import { fetchGetWithAuth, fetchPutWithAuth } from "../../auth/fetchWithAuth"; // Assuming you have a fetch utility

const Applications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const jobId = new URLSearchParams(location.search).get('jobId'); // Extract jobId from query params

    useEffect(() => {
        if (!jobId) {
            setError("Job ID is missing.");
            setLoading(false);
            return;
        }

        const fetchApplications = async () => {
            try {
                setLoading(true);
                setError(null);  // Reset previous errors
                const response = await fetchGetWithAuth(`${process.env.REACT_APP_API_URL}/api/applications/employer/job?jobId=${jobId}`);
                if (response.length === 0) {
                    setError("No applications found for this job.");
                }
                setApplications(response);
            } catch (err) {
                setError("Failed to load applications.");
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [jobId]); // Only re-run if jobId changes

    // Function to handle status update
    const handleStatusChange = async (applicationId, newStatus) => {
        try {
            const updatedApplication = await fetchPutWithAuth(
                `${process.env.REACT_APP_API_URL}/api/applications/${applicationId}/status`,
                { status: newStatus }
            );
            setApplications((prevApplications) =>
                prevApplications.map((application) =>
                    application.id === applicationId
                        ? { ...application, status: newStatus }
                        : application
                )
            );
        } catch (err) {
            setError("Failed to update application status.");
        }
    };

    // Loading state
    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <Typography variant="h6" align="center">Loading applications...</Typography>
            </Box>
        );
    }

    // Error state
    if (error) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <Typography variant="h6" color="error" align="center">{error}</Typography>
            </Box>
        );
    }

    // Display applications if data is fetched successfully
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Applications for Job
            </Typography>

            {applications.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Applicant</TableCell>
                                <TableCell>Job Title</TableCell>
                                <TableCell>Applied On</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Update Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {applications.map((application) => (
                                <TableRow key={application.id}>
                                    <TableCell>{application.applicantName || "Anonymous"}</TableCell>
                                    <TableCell>{application.jobTitle || "Unknown Job"}</TableCell>
                                    <TableCell>{application.createdAt}</TableCell>
                                    <TableCell>{application.status}</TableCell>
                                    <TableCell>
                                        <FormControl fullWidth>
                                            <Select
                                                value={application.status}
                                                onChange={(e) => handleStatusChange(application.id, e.target.value)}
                                            >
                                                <MenuItem value="UNDER_REVIEW">Under Review</MenuItem>
                                                <MenuItem value="ACCEPTED">Accepted</MenuItem>
                                                <MenuItem value="REJECTED">Rejected</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography variant="body1" color="textSecondary" align="center" sx={{ mt: 3 }}>
                    No applications received yet.
                </Typography>
            )}
        </Box>
    );
};

export default Applications;
