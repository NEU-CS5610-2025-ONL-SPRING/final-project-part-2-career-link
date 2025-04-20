import React, { useState, useEffect, useCallback } from 'react';
import {
  Container, Typography, Box, Chip, CircularProgress, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import { useAuthUser } from '../../auth/authContext';
import { fetchGetWithAuth } from '../../auth/fetchWithAuth';
import { styled } from '@mui/material/styles';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const formatDate = (dateString) =>
  new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(dateString));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 500,
  color: theme.palette.text.primary,
  padding: theme.spacing(1.5),
  fontSize: theme.typography.body2.fontSize,
}));

const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 700,
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(1.5),
  fontSize: theme.typography.body2.fontSize,
}));

const MyApplications = () => {
  const { user } = useAuthUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applications, setApplications] = useState([]);

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

  const renderApplicationTable = () => (
    <TableContainer component={Paper} sx={{ mt: 3, borderRadius: 2, overflowX: 'auto', boxShadow: 2 }}>
      <Table sx={{ minWidth: 600 }} size="small">
        <TableHead>
          <TableRow>
            <StyledHeaderCell>Job Title</StyledHeaderCell>
            <StyledHeaderCell>Company</StyledHeaderCell>
            <StyledHeaderCell>Location</StyledHeaderCell>
            <StyledHeaderCell>Applied Date</StyledHeaderCell>
            <StyledHeaderCell>Status</StyledHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {applications.map((app) => (
            <TableRow key={app.id} hover>
              <StyledTableCell>{app.job?.isDeleted ? `${app.job.title} (Closed)` : app.job?.title}</StyledTableCell>
              <StyledTableCell>{app.job?.company?.name}</StyledTableCell>
              <StyledTableCell>{app.job?.location}</StyledTableCell>
              <StyledTableCell>{formatDate(app.appliedAt)}</StyledTableCell>
              <StyledTableCell>
                <Chip
                  label={app.status.replace('_', ' ')}
                  color={getStatusColor(app.status)}
                  size="small"
                  sx={{ fontWeight: 500 }}
                />
              </StyledTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
        renderApplicationTable()
      )}
    </Container>
  );
};

export default MyApplications;
