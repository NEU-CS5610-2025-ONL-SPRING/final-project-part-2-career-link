import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  Container, Typography, Box, Grid, Card, CardContent, Chip,
  CircularProgress, Alert, Button, TextField, Paper, List, ListItemButton, ListItemText
} from '@mui/material';
import { useAuthUser } from '../../auth/authContext';
import axios from 'axios';
import {
  Business as BusinessIcon,
  Search as SearchIcon,
  FilterAlt as FilterIcon,
  DateRange as DateIcon
} from '@mui/icons-material';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const BrowseJobs = () => {
    const theme = useTheme();
const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { user } = useAuthUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [filters, setFilters] = useState({ title: '', location: '', minSalary: '' });

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (filters.title.trim()) params.title = filters.title;
      if (filters.location.trim()) params.location = filters.location;
      if (filters.minSalary.trim()) params.minSalary = filters.minSalary;
      const jobsRes = await axios.get(`${API_BASE_URL}/api/jobs`, { params, withCredentials: true });
      setJobs(jobsRes.data);
      setSelectedJob(jobsRes.data[0] || null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/applications/${user.id}`, { withCredentials: true });
      setApplications(res.data);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, []);

  const handleApply = async (jobId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/applications`,
        { jobId: Number(jobId), userId: Number(user.id) },
        { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
      );
      setApplications(prev => [...prev, response.data]);
      setJobs(prev => prev.map(job => job.id === jobId ? { ...job, hasApplied: true } : job));
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
    fetchJobs();
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Browse Jobs</Typography>
      <Paper component="form" onSubmit={handleFilterSubmit} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField fullWidth label="Job Title" name="title" value={filters.title} onChange={handleFilterChange} InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1 }} /> }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField fullWidth label="Location" name="location" value={filters.location} onChange={handleFilterChange} />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField fullWidth label="Min Salary ($)" name="minSalary" type="number" value={filters.minSalary} onChange={handleFilterChange} />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button type="submit" variant="contained" fullWidth sx={{ height: '100%' }}>Apply</Button>
          </Grid>
        </Grid>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Box sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            height: isMobile ? 'auto' : '70vh',
            gap: 2
          }}>
          
          {/* Left List */}
          <Paper sx={{
  width: isMobile ? '100%' : '50%',
  overflowY: 'auto',
  p: isMobile ? 2 : 3
}}>
            <List>
              {jobs.map(job => (
                <ListItemButton key={job.id} selected={selectedJob?.id === job.id} onClick={() => setSelectedJob(job)}>
                  <ListItemText primary={job.title} secondary={`${job.company.name} • ${job.location}`} />
                </ListItemButton>
              ))}
            </List>
          </Paper>

          {/* Right Detail */}
          <Paper sx={{
  width: isMobile ? '100%' : '50%',
  overflowY: 'auto',
  p: isMobile ? 2 : 3
}}>
            {selectedJob ? (
              <>
                <Typography variant="h5" gutterBottom>{selectedJob.title}</Typography>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  <BusinessIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  {selectedJob.company.name} • {selectedJob.location}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}><strong>Posted by:</strong> {selectedJob.employer.username}</Typography>
                {selectedJob.description && <Typography sx={{ mb: 2 }}>{selectedJob.description}</Typography>}
                {selectedJob.salary && <Typography sx={{ mb: 1 }}><strong>Salary:</strong> ${selectedJob.salary.toLocaleString()} per year</Typography>}
                {selectedJob.requirements && <Typography sx={{ mb: 2 }}><strong>Requirements:</strong> {selectedJob.requirements}</Typography>}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  <DateIcon sx={{ mr: 1, fontSize: 'small' }} />
                  Posted: {new Date(selectedJob.createdAt).toLocaleDateString()}
                </Typography>
                {applications.some(app => app.jobId === selectedJob.id) ? (
                  <Chip label="Applied" color="success" />
                ) : (
                  <Button variant="contained" onClick={() => handleApply(selectedJob.id)}>Apply</Button>
                )}
              </>
            ) : <Typography>Select a job to view details</Typography>}
          </Paper>
        </Box>
      )}
    </Container>
  );
};

export default BrowseJobs;
