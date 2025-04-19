import React, { useState, useEffect, useCallback } from 'react';
import {
  Container, Typography, Grid, Card, CardContent,
  Box, Chip, CircularProgress, Alert, Divider, Avatar,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, ToggleButtonGroup, ToggleButton
} from '@mui/material';
import { useAuthUser } from '../../auth/authContext';
import { fetchGetWithAuth } from '../../auth/fetchWithAuth';
import { DateRange as DateIcon, ViewModule, TableRows } from '@mui/icons-material';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const formatDate = (dateString) =>
  new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(dateString));

const MyApplications = () => {
  const { user } = useAuthUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applications, setApplications] = useState([]);
  const [view, setView] = useState('cards'); // New state for view toggle

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await fetchGetWithAuth(`${API_BASE_URL}/api/applications/${user?.id}`);
        setApplications(data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch applications');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchApplications();
    }
  }, [user?.id]);

  const getStatusColor = useCallback((status) => {
    switch (status) {
      case 'ACCEPTED': return 'success';
      case 'REJECTED': return 'error';
      case 'UNDER_REVIEW': return 'warning';
      default: return 'default';
    }
  }, []);

  const renderApplicationCard = (application) => {
    const { job, appliedAt, status, id } = application;

    return (
      <Grid item xs={12} key={id}>
        <Card elevation={2} sx={{ borderRadius: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar>{job?.title?.[0] || '?'}</Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    {job?.isDeleted ? `${job.title} (Closed)` : job?.title}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    {job?.company?.name} • {job?.location}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 1 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DateIcon fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    Applied on: {formatDate(appliedAt)}
                  </Typography>
                </Box>
                <Chip
                  label={status.replace('_', ' ')}
                  color={getStatusColor(status)}
                  sx={{ fontWeight: 500 }}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  const renderApplicationTable = () => (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Job Title</TableCell>
            <TableCell>Company</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Applied At</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {applications.map((app) => (
            <TableRow key={app.id}>
              <TableCell>{app.job?.isDeleted ? `${app.job.title} (Closed)` : app.job?.title}</TableCell>
              <TableCell>{app.job?.company?.name}</TableCell>
              <TableCell>{app.job?.location}</TableCell>
              <TableCell>{formatDate(app.appliedAt)}</TableCell>
              <TableCell>
                <Chip
                  label={app.status.replace('_', ' ')}
                  color={getStatusColor(app.status)}
                  size="small"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">
          My Job Applications
        </Typography>

        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={(e, newView) => newView && setView(newView)}
          size="small"
        >
          <ToggleButton value="cards"><ViewModule fontSize="small" /></ToggleButton>
          <ToggleButton value="table"><TableRows fontSize="small" /></ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : applications.length === 0 ? (
        <Typography variant="body1" color="text.secondary" textAlign="center">
          You haven’t applied to any jobs yet.
        </Typography>
      ) : view === 'cards' ? (
        <Grid container spacing={3}>
          {applications.map(renderApplicationCard)}
        </Grid>
      ) : (
        renderApplicationTable()
      )}
    </Container>
  );
};

export default MyApplications;
