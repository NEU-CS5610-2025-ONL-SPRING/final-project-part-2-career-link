import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  Container, Typography, Box, Grid, Paper, TextField, Button,
  CircularProgress, Alert, List, ListItemButton, ListItemText,
  Chip, Dialog, DialogTitle, DialogContent, IconButton, Stack, Divider
} from '@mui/material';
import {
  Business as BusinessIcon,
  Search as SearchIcon,
  DateRange as DateIcon,
  Close as CloseIcon
} from '@mui/icons-material';

import { useAuthUser } from "../../auth/authContext";
import { fetchGetWithAuth, fetchPostWithAuth } from "../../auth/fetchWithAuth";

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const BrowseJobs = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [dialogOpen, setDialogOpen] = useState(false);

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
      const queryString = new URLSearchParams(params).toString();
      const data = await fetchGetWithAuth(`${API_BASE_URL}/api/jobs?${queryString}`);
      setJobs(data);
      setSelectedJob(data[0] || null);
    } catch (err) {
      setError(err.message || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const data = await fetchGetWithAuth(`${API_BASE_URL}/api/applications/${user.id}`);
      setApplications(data);
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
      const data = await fetchPostWithAuth(`${API_BASE_URL}/api/applications`, {
        jobId: Number(jobId),
        userId: Number(user.id)
      });
      setApplications(prev => [...prev, data]);
      setJobs(prev => prev.map(job => job.id === jobId ? { ...job, hasApplied: true } : job));
    } catch (err) {
      setError(err.message || 'Failed to apply for job');
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

  const JobDetailSection = ({ job }) => (
    <Stack spacing={2}>
      <Typography variant="h5" fontWeight={700}>{job.title}</Typography>

      <Box display="flex" alignItems="center" gap={1}>
        <BusinessIcon fontSize="small" />
        <Typography variant="subtitle1">{job.company.name} • {job.location}</Typography>
      </Box>

      <Divider />

      <Stack spacing={1}>
        <Typography variant="body2"><strong>Posted by:</strong> {job.employer.username}</Typography>
        {job.description && <Typography variant="body1">{job.description}</Typography>}
        {job.salary && <Typography variant="body1"><strong>Salary:</strong> ${job.salary.toLocaleString()} per year</Typography>}
        {job.requirements && <Typography variant="body1"><strong>Requirements:</strong> {job.requirements}</Typography>}
        <Typography variant="body2" color="text.secondary">
          <DateIcon sx={{ mr: 1, fontSize: 'small' }} />
          Posted: {new Date(job.createdAt).toLocaleDateString()}
        </Typography>
      </Stack>

      {applications.some(app => app.jobId === job.id) ? (
        <Chip label="Applied" color="success" sx={{ width: 'fit-content', px: 2, py: 1, fontWeight: 600 }} />
      ) : (
        <Button variant="contained" fullWidth onClick={() => handleApply(job.id)}>
          Apply
        </Button>
      )}
    </Stack>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: "primary.main",
          textAlign: "center",
          mb: 2,
          fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" }, 
          background: "linear-gradient(45deg, #2A4D8C, #D24F75)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          color: "transparent",
          textTransform: "uppercase"  
        }}
      >
        Explore Job Opportunities
      </Typography>
      <Paper
        component="form"
        onSubmit={handleFilterSubmit}
        elevation={3}
        sx={{ p: isMobile ? 2 : 3, mb: 4, borderRadius: 2, backgroundColor: 'background.paper', boxShadow: 3 }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Job Title"
              name="title"
              value={filters.title}
              onChange={handleFilterChange}
              InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1 }} /> }}
              variant="outlined"
              size="small"
              sx={{ '& .MuiInputBase-root': { borderRadius: '8px' } }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              variant="outlined"
              size="small"
              sx={{ '& .MuiInputBase-root': { borderRadius: '8px' } }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="Min Salary ($)"
              name="minSalary"
              type="number"
              value={filters.minSalary}
              onChange={handleFilterChange}
              variant="outlined"
              size="small"
              sx={{ '& .MuiInputBase-root': { borderRadius: '8px' } }}
            />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ height: '100%', backgroundColor: theme.palette.primary.main, '&:hover': { backgroundColor: theme.palette.primary.dark }, borderRadius: '8px' }}
            >
              Filter
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', height: isMobile ? 'auto' : '72vh', gap: 3 }}>
          <Paper elevation={2} sx={{ width: isMobile ? '100%' : '45%', overflowY: 'auto', borderRadius: 2, p: isMobile ? 1.5 : 2.5, backgroundColor: 'background.paper', boxShadow: 3 }}>
            {jobs.length > 0 ? (
              <List disablePadding>
                {jobs.map((job) => (
                  <ListItemButton
                    key={job.id}
                    selected={selectedJob?.id === job.id}
                    onClick={() => {
                      setSelectedJob(job);
                      if (isMobile) setDialogOpen(true);
                    }}
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      '&.Mui-selected': {
                        backgroundColor: theme.palette.primary.light,
                        '& .MuiTypography-root': { color: '#fff' },
                        '& .MuiListItemText-secondary': { color: '#e0e0e0' }
                      },
                      '&:hover': { backgroundColor: theme.palette.primary.lighter }
                    }}
                  >
                    <ListItemText
                      primary={<Typography fontWeight={600}>{job.title}</Typography>}
                      secondary={`${job.company.name} • ${job.location}`}
                    />
                  </ListItemButton>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No jobs found with the selected filters.
              </Typography>
            )}
          </Paper>

          {!isMobile && (
            <Paper elevation={2} sx={{ width: '55%', overflowY: 'auto', borderRadius: 2, p: 3, boxShadow: 3 }}>
              {selectedJob ? <JobDetailSection job={selectedJob} /> : <Typography>Select a job to view details</Typography>}
            </Paper>
          )}
        </Box>
      )}

      {isMobile && selectedJob && (
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm" scroll="paper" PaperProps={{ sx: { mt: '64px', borderRadius: 2 } }}>
          <DialogTitle>
            {selectedJob.title}
            <IconButton edge="end" color="inherit" onClick={() => setDialogOpen(false)} aria-label="close" sx={{ position: 'absolute', right: 8, top: 8 }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <JobDetailSection job={selectedJob} />
          </DialogContent>
        </Dialog>
      )}
    </Container>
  );
};

export default BrowseJobs;
