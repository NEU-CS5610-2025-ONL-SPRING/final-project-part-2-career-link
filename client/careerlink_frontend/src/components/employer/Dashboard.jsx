import React, { useEffect, useState } from 'react';
import { useAuthUser } from '../../auth/authContext';
import { fetchGetWithAuth, fetchPostWithAuth } from '../../auth/fetchWithAuth.js';
import {
    Box,
    Typography,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    Snackbar,
    Alert,
    Grid,
    Card,
    CardHeader,
    CardContent,
    Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import WorkIcon from '@mui/icons-material/Work';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';

const EmployerDashboard = () => {
    const { user, hasRole } = useAuthUser();
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openJobDialog, setOpenJobDialog] = useState(false);
    const [openStatusDialog, setOpenStatusDialog] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [newJob, setNewJob] = useState({
        title: '',
        description: '',
        location: '',
        salary: '',
        requirements: ''
    });

    // Fetch employer data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch jobs posted by this employer
                const jobsData = await fetchGetWithAuth(`${process.env.REACT_APP_API_URL}/api/jobs?postedBy=current-user`);
                setJobs(jobsData);

                // Fetch applications for employer's jobs
                const appsData = await fetchGetWithAuth(`${process.env.REACT_APP_API_URL}/api/applications/employer`);
                setApplications(appsData);
            } catch (err) {
                setError(err.message);
                setSnackbar({ open: true, message: 'Failed to load data', severity: 'error' });
            } finally {
                setLoading(false);
            }
        };

        if (user && hasRole('EMPLOYER')) {
            fetchData();
        }
    }, [user, hasRole]);

    const handleCreateJob = async () => {
        try {
            if (!newJob.title || !newJob.description || !newJob.location) {
                throw new Error('Title, description, and location are required');
            }
    
            const jobData = {
                title: newJob.title,
                description: newJob.description,
                location: newJob.location,
                salary: newJob.salary ? Number(newJob.salary) : null,
                requirements: newJob.requirements
            };
    
            const response = await fetchPostWithAuth(
                `${process.env.REACT_APP_API_URL}/api/jobs`,
                jobData
            );
    
            if (!response.id) {
                const refreshedJobs = await fetchGetWithAuth(
                    `${process.env.REACT_APP_API_URL}/api/jobs?postedBy=current-user`
                );
                setJobs(refreshedJobs);
            } else {
                const completeJob = {
                    id: response.id,
                    title: response.title || jobData.title,
                    description: response.description || jobData.description,
                    location: response.location || jobData.location,
                    salary: response.salary || jobData.salary,
                    requirements: response.requirements || jobData.requirements,
                    companyId: response.companyId || 1, 
                    postedBy: response.postedBy || user.id, 
                    applications: response.applications || [],
                    company: response.company || { 
                        id: response.companyId || 1,
                        name: response.company?.name || 'Your Company' 
                    },
                    createdAt: response.createdAt || new Date().toISOString()
                };
    
                setJobs(prevJobs => [...prevJobs, completeJob]);
            }
    
            setOpenJobDialog(false);
            setNewJob({
                title: '',
                description: '',
                location: '',
                salary: '',
                requirements: ''
            });
            
            setSnackbar({ 
                open: true, 
                message: 'Job created successfully', 
                severity: 'success' 
            });
        } catch (err) {
            console.error('Job creation error:', err);
            setSnackbar({ 
                open: true, 
                message: err.message || 'Failed to create job', 
                severity: 'error' 
            });
        }
    };

    const handleUpdateStatus = async (status) => {
        try {
            await fetchPostWithAuth(
                `${process.env.REACT_APP_API_URL}/api/applications/${selectedApplication.id}/status`,
                { status }
            );

            setApplications(applications.map(app =>
                app.id === selectedApplication.id ? { ...app, status } : app
            ));

            setOpenStatusDialog(false);
            setSnackbar({ open: true, message: 'Status updated successfully', severity: 'success' });
        } catch (err) {
            setSnackbar({ open: true, message: 'Failed to update status', severity: 'error' });
        }
    };

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="error">{error}</Typography>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => window.location.reload()}
                    sx={{ mt: 2 }}
                >
                    Retry
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Employer Dashboard
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Manage your job postings and applications
                </Typography>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                    <Card elevation={3}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <WorkIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                                <Box>
                                    <Typography variant="h6" color="text.secondary">
                                        Active Jobs
                                    </Typography>
                                    <Typography variant="h4">
                                        {jobs.length}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card elevation={3}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <PeopleIcon color="secondary" sx={{ fontSize: 40, mr: 2 }} />
                                <Box>
                                    <Typography variant="h6" color="text.secondary">
                                        Total Applications
                                    </Typography>
                                    <Typography variant="h4">
                                        {applications.length}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card elevation={3}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <EventIcon color="info" sx={{ fontSize: 40, mr: 2 }} />
                                <Box>
                                    <Typography variant="h6" color="text.secondary">
                                        New This Week
                                    </Typography>
                                    <Typography variant="h4">
                                        {applications.filter(app => 
                                            new Date(app.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                                        ).length}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Jobs Section */}
            <Card sx={{ mb: 4 }} elevation={3}>
                <CardHeader
                    title="Your Job Postings"
                    action={
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setOpenJobDialog(true)}
                            size="large"
                        >
                            Post New Job
                        </Button>
                    }
                />
                <Divider />
                <CardContent>
                    {jobs.length > 0 ? (
                        <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: 'background.default' }}>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Location</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Salary</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Applications</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {jobs.map((job) => (
                                        <TableRow 
                                            key={job.id}
                                            hover
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell>{job.title}</TableCell>
                                            <TableCell>{job.location}</TableCell>
                                            <TableCell>
                                                {job.salary ? `$${job.salary.toLocaleString()}` : 'Not specified'}
                                            </TableCell>
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
                                                    {applications.filter(app => app.jobId === job.id).length}
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            p: 4,
                            textAlign: 'center'
                        }}>
                            <WorkIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary">
                                You haven't posted any jobs yet
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => setOpenJobDialog(true)}
                                sx={{ mt: 2 }}
                            >
                                Post Your First Job
                            </Button>
                        </Box>
                    )}
                </CardContent>
            </Card>

            {/* Applications Section */}
            <Card elevation={3}>
                <CardHeader
                    title="Job Applications"
                />
                <Divider />
                <CardContent>
                    {applications.length > 0 ? (
                        <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: 'background.default' }}>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Applicant</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Job Title</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Applied On</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {applications.map((application) => (
                                        <TableRow 
                                            key={application.id}
                                            hover
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell>{application.applicantName || 'Anonymous'}</TableCell>
                                            <TableCell>
                                                {jobs.find(job => job.id === application.jobId)?.title || 'Unknown Job'}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(application.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                <Box
                                                    sx={{
                                                        display: 'inline-block',
                                                        px: 1.5,
                                                        py: 0.5,
                                                        borderRadius: 1,
                                                        backgroundColor: 
                                                            application.status === 'approved' ? 'success.light' :
                                                            application.status === 'rejected' ? 'error.light' : 
                                                            'warning.light',
                                                        color: 
                                                            application.status === 'approved' ? 'success.dark' :
                                                            application.status === 'rejected' ? 'error.dark' : 
                                                            'warning.dark',
                                                        fontWeight: 'medium'
                                                    }}
                                                >
                                                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    onClick={() => {
                                                        setSelectedApplication(application);
                                                        setOpenStatusDialog(true);
                                                    }}
                                                >
                                                    Update Status
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            p: 4,
                            textAlign: 'center'
                        }}>
                            <PeopleIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary">
                                No applications received yet
                            </Typography>
                        </Box>
                    )}
                </CardContent>
            </Card>

            {/* Create Job Dialog */}
            <Dialog 
                open={openJobDialog} 
                onClose={() => setOpenJobDialog(false)}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle sx={{ borderBottom: '1px solid', borderColor: 'divider', pb: 2 }}>
                    Post New Job
                </DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Job Title"
                                value={newJob.title}
                                onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                                fullWidth
                                margin="normal"
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Location"
                                value={newJob.location}
                                onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                                fullWidth
                                margin="normal"
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Description"
                                value={newJob.description}
                                onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                                multiline
                                rows={6}
                                fullWidth
                                margin="normal"
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Salary"
                                type="number"
                                value={newJob.salary}
                                onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                                fullWidth
                                margin="normal"
                                InputProps={{
                                    startAdornment: '$',
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Requirements"
                                value={newJob.requirements}
                                onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
                                multiline
                                rows={4}
                                fullWidth
                                margin="normal"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Button 
                        onClick={() => setOpenJobDialog(false)}
                        sx={{ mr: 2 }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleCreateJob} 
                        variant="contained"
                        disabled={!newJob.title || !newJob.description || !newJob.location}
                    >
                        Post Job
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Update Status Dialog */}
            <Dialog 
                open={openStatusDialog} 
                onClose={() => setOpenStatusDialog(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle sx={{ borderBottom: '1px solid', borderColor: 'divider', pb: 2 }}>
                    Update Application Status
                </DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Job: {selectedApplication?.jobTitle || 'Unknown Job'}
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                            Applicant: {selectedApplication?.applicantName || 'Anonymous'}
                        </Typography>
                    </Box>
                    <Select
                        value={selectedApplication?.status || ''}
                        onChange={(e) => handleUpdateStatus(e.target.value)}
                        fullWidth
                    >
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="reviewed">Reviewed</MenuItem>
                        <MenuItem value="approved">Approved</MenuItem>
                        <MenuItem value="rejected">Rejected</MenuItem>
                    </Select>
                </DialogContent>
                <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Button 
                        onClick={() => setOpenStatusDialog(false)}
                        sx={{ mr: 2 }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={() => handleUpdateStatus(selectedApplication?.status)}
                        variant="contained"
                    >
                        Update
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default EmployerDashboard;