import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Card,
    CircularProgress,
    Box,
    Link,
    Avatar,
    Alert,
    Tooltip,
    useMediaQuery,
    Divider
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { getAllCompanies } from '../services/companyService';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LanguageIcon from '@mui/icons-material/Language';

const Companies = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const data = await getAllCompanies();
                setCompanies(data);
            } catch (err) {
                setError(err.message || 'Failed to fetch companies');
            } finally {
                setLoading(false);
            }
        };

        fetchCompanies();
    }, []);

    if (loading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                <CircularProgress size={40} />
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 5 }}>
            <Box textAlign="center" sx={{ mb: 6 }}>
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
                    Company Directory
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Discover industry leaders, collaborators, and innovators.
                </Typography>
            </Box>

            {companies.length === 0 ? (
                <Typography variant="body1" color="text.secondary">
                    No companies found.
                </Typography>
            ) : (
                companies.map((company) => (
                    <Card
                        key={company.id}
                        elevation={3}
                        sx={{
                            mb: 4,
                            borderRadius: 4,
                            p: 3,
                            backgroundColor: theme.palette.background.paper,
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: isMobile ? 'column' : 'row' }}>
                            <Avatar
                                sx={{
                                    width: 56,
                                    height: 56,
                                    fontSize: '1.3rem',
                                    bgcolor: theme.palette.secondary.main,
                                    mr: 2,
                                    mb: isMobile ? 1 : 0,
                                }}
                            >
                                {company.name?.[0]?.toUpperCase() || '?'}
                            </Avatar>
                            <Box flex={1}>
                                <Typography variant="h6" fontWeight={600}>
                                    {company.name}
                                </Typography>

                                {company.location && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                        <LocationOnIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {company.location}
                                        </Typography>
                                    </Box>
                                )}

                                {company.website && (
                                    <Tooltip title="Visit Website" arrow>
                                        <Link
                                            href={
                                                company.website.startsWith('http')
                                                    ? company.website
                                                    : `https://${company.website}`
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                mt: 1,
                                                fontSize: '0.9rem',
                                                color: theme.palette.primary.main
                                            }}
                                        >
                                            <LanguageIcon fontSize="small" sx={{ mr: 0.5 }} />
                                            {company.website.replace(/^https?:\/\//, '')}
                                        </Link>
                                    </Tooltip>
                                )}
                            </Box>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ whiteSpace: 'pre-wrap' }}
                        >
                            {company.description || 'No description available.'}
                        </Typography>
                    </Card>
                ))
            )}
        </Container>
    );
};

export default Companies;
