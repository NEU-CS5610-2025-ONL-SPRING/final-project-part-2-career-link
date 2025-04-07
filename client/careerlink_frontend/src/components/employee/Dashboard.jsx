
import React, { useState, useEffect } from 'react';
import { Tooltip } from '@mui/material';
import {
    Container,
    Typography,
    Box,
    Tabs,
    Tab,
    Grid,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Alert,
    Button,
    TextField,
    Paper,
    Divider
} from '@mui/material';
import { useAuthUser } from '../../auth/authContext';
import axios from 'axios';
import {
    Business as BusinessIcon,
    Work as WorkIcon,
    Description as ResumeIcon,
    Search as SearchIcon,
    FilterAlt as FilterIcon,
    DateRange as DateIcon
} from '@mui/icons-material';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';


const EmployeeDashboard = () => {
    const { user } = useAuthUser();
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [filters, setFilters] = useState({
        title: '',
        location: '',
        minSalary: '',
        skills: ''
    });

    // Fetch data based on active tab
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                if (activeTab === 0) {
                    const params = {
                        title: filters.title || undefined,
                        location: filters.location || undefined,
                        minSalary: filters.minSalary || undefined
                    };
                    const jobsRes = await axios.get(`${API_BASE_URL}/api/jobs`, {
                        params,
                        withCredentials: true
                    });
                    setJobs(jobsRes.data);
                } else if (activeTab === 1) {
                    const appsRes = await axios.get(`${API_BASE_URL}/api/applications/${user.id}`, {
                        withCredentials: true
                    });
                    setApplications(appsRes.data);
                }

                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch data');
                setLoading(false);
            }
        };


        fetchData();
    }, [activeTab, user.id, filters]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleApply = async (jobId) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/applications`,
                {
                    jobId: Number(jobId),
                    userId: Number(user.id)
                },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Update both applications and jobs state
            setApplications(prev => [...prev, response.data]);
            setJobs(prev => prev.map(job =>
                job.id === jobId ? { ...job, hasApplied: true } : job
            ));

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to apply for job');
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        // Tab change will trigger the useEffect with new filters
        setActiveTab(0);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'ACCEPTED': return 'success';
            case 'REJECTED': return 'error';
            case 'UNDER_REVIEW': return 'warning';
            default: return 'primary';
        }
    };

    if (loading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ py: 4 }}>
                <Alert severity="error" onClose={() => setError(null)}>
                    {error}
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Job Seeker Dashboard
            </Typography>

            <Tabs
                value={activeTab}
                onChange={handleTabChange}
                sx={{ mb: 4 }}
                variant="fullWidth"
            >
                <Tab label="Browse Jobs" />
                <Tab label="My Applications" />
                <Tab label="My Profile" />
            </Tabs>

            {activeTab === 0 && (
                <>
                    <Paper
                        component="form"
                        onSubmit={handleFilterSubmit}
                        sx={{ p: 3, mb: 4 }}
                    >
                        <Typography variant="h6" gutterBottom>
                            <FilterIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                            Filter Jobs
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Job Title"
                                    name="title"
                                    value={filters.title}
                                    onChange={handleFilterChange}
                                    InputProps={{
                                        startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Location"
                                    name="location"
                                    value={filters.location}
                                    onChange={handleFilterChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <TextField
                                    fullWidth
                                    label="Min Salary ($)"
                                    name="minSalary"
                                    type="number"
                                    value={filters.minSalary}
                                    onChange={handleFilterChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    sx={{ height: '100%' }}
                                >
                                    Apply Filters
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>

                    {jobs.length === 0 ? (
                        <Typography variant="body1" color="text.secondary" textAlign="center">
                            No jobs found matching your criteria
                        </Typography>
                    ) : (
                        <Grid container spacing={3}>
                                {jobs.map(job => (
                                    <Grid item xs={12} key={job.id}>
                                        <Card elevation={3}>
                                            <CardContent>
                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    flexDirection: { xs: 'column', sm: 'row' },
                                                    gap: 2
                                                }}>
                                                    <Box>
                                                        <Typography variant="h6" gutterBottom>
                                                            {job.title}
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                            <BusinessIcon fontSize="small" sx={{ mr: 1 }} />
                                                            <Typography variant="body1">
                                                                {job.company.name} • {job.location}
                                                            </Typography>
                                                        </Box>
                                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                                            <strong>Posted by:</strong> {job.employer.username}
                                                        </Typography>
                                                        {job.description && (
                                                            <Typography variant="body2" sx={{ mb: 1 }}>
                                                                {job.description}
                                                            </Typography>
                                                        )}
                                                        {job.salary && (
                                                            <Typography variant="body1" sx={{ mb: 1 }}>
                                                                <strong>Salary:</strong> ${job.salary.toLocaleString()} per year
                                                            </Typography>
                                                        )}
                                                        {job.requirements && (
                                                            <Typography variant="body2" sx={{ mb: 1 }}>
                                                                <strong>Requirements:</strong> {job.requirements}
                                                            </Typography>
                                                        )}
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <DateIcon fontSize="small" sx={{ mr: 1 }} />
                                                            <Typography variant="body2" color="text.secondary">
                                                                Posted: {new Date(job.createdAt).toLocaleDateString()}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                    <Box sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: { xs: 'flex-start', sm: 'flex-end' }
                                                    }}>
                                                        {applications.some(app => app.jobId === job.id) ? (
                                                            <Chip
                                                                label="Applied"
                                                                color="success"
                                                                sx={{ minWidth: 100 }}
                                                            />
                                                        ) : (
                                                                <Button
                                                                    variant="contained"
                                                                    onClick={() => handleApply(job.id)}
                                                                    sx={{ minWidth: 100 }}
                                                                >
                                                                    Apply
                                                                </Button>
                                                        )}
                                                    </Box>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                        </Grid>
                    )}
                </>
            )}

            {activeTab === 1 && (
                <>
                    <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                        My Job Applications ({applications.length})
                    </Typography>

                    {applications.length === 0 ? (
                        <Typography variant="body1" color="text.secondary" textAlign="center">
                            You haven't applied to any jobs yet
                        </Typography>
                    ) : (
                        <Grid container spacing={3}>
                            {applications.map(application => (
                                <Grid item xs={12} key={application.id}>
                                    <Card elevation={3}>
                                        <CardContent>
                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                flexDirection: { xs: 'column', sm: 'row' },
                                                gap: 2
                                            }}>
                                                <Box>
                                                    <Typography variant="h6" gutterBottom>
                                                        {application.job.title}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                        <BusinessIcon fontSize="small" sx={{ mr: 1 }} />
                                                        <Typography variant="body1">
                                                            {application.job.company.name} • {application.job.location}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <DateIcon fontSize="small" sx={{ mr: 1 }} />
                                                        <Typography variant="body2" color="text.secondary">
                                                            Applied: {new Date(application.appliedAt).toLocaleDateString()}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: { xs: 'flex-start', sm: 'flex-end' }
                                                }}>
                                                    <Chip
                                                        label={application.status.replace('_', ' ')}
                                                        color={getStatusColor(application.status)}
                                                        sx={{ minWidth: 120 }}
                                                    />
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </>
            )}

            {activeTab === 2 && (
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card elevation={3}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    My Profile
                                </Typography>
                                <Divider sx={{ my: 2 }} />

                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            <strong>Basic Information</strong>
                                        </Typography>
                                        <Typography>
                                            <strong>Name:</strong> {user.username}
                                        </Typography>
                                        <Typography>
                                            <strong>Email:</strong> {user.email}
                                        </Typography>
                                        <Typography sx={{ mt: 1 }}>
                                            <strong>Role:</strong> {user.role === 'JOB_SEEKER' ? 'Job Seeker' : 'Employer'}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            <strong>Professional Details</strong>
                                        </Typography>
                                        <Typography>
                                            <strong>Skills:</strong> {user.skills || 'Not specified'}
                                        </Typography>
                                        {user.resumeUrl && (
                                            <Button
                                                variant="outlined"
                                                startIcon={<ResumeIcon />}
                                                sx={{ mt: 1 }}
                                                href={user.resumeUrl}
                                                target="_blank"
                                            >
                                                View Resume
                                            </Button>
                                        )}
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}
        </Container>
    );
};

export default EmployeeDashboard;