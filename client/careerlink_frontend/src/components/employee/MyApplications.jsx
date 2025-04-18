import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Grid, Card, CardContent,
  Box, Chip, CircularProgress, Alert, Divider, Avatar
} from '@mui/material';
import { useAuthUser } from '../../auth/authContext';
import axios from 'axios';
import {
  Business as BusinessIcon,
  DateRange as DateIcon
} from '@mui/icons-material';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const MyApplications = () => {
  const { user } = useAuthUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/applications/${user.id}`, {
          withCredentials: true
        });
        setApplications(res.data);
      } catch (err) {
        setError('Failed to fetch applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user.id]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACCEPTED': return 'success';
      case 'REJECTED': return 'error';
      case 'UNDER_REVIEW': return 'warning';
      default: return 'primary';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Job Applications
      </Typography>

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
      ) : (
        <Grid container spacing={3}>
          {applications.map(application => (
            <Grid item xs={12} key={application.id}>
              <Card elevation={2} sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar>
                        {application.job.title[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight={600}>
                          {application.job.title}
                        </Typography>
                        <Typography variant="subtitle2" color="text.secondary">
                          {application.job.company.name} • {application.job.location}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 1 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DateIcon fontSize="small" />
                        <Typography variant="body2" color="text.secondary">
                          Applied on: {new Date(application.appliedAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Chip
                        label={application.status.replace('_', ' ')}
                        color={getStatusColor(application.status)}
                        sx={{ fontWeight: 500 }}
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default MyApplications;
