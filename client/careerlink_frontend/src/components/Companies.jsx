import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CircularProgress,
    Box,
    Link,
    Avatar,
    Alert
} from '@mui/material';
import { getAllCompanies } from '../services/companyService';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn'; 

const Companies = () => {
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
            <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
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
        <Container maxWidth="lg">
            <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
                All Companies
            </Typography>

            {companies.length === 0 ? (
                <Typography variant="body1" color="text.secondary">
                    No companies found.
                </Typography>
            ) : (
                <Grid container spacing={3}>
                    {companies.map((company) => (
                        <Grid item key={company.id} xs={12} sm={6} md={4}>
                            <Card sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 3
                                }
                            }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                            <BusinessIcon />
                                        </Avatar>
                                        <Typography variant="h6" component="div">
                                            {company.name}
                                        </Typography>
                                    </Box>

                                    {company.location && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
                                                {company.location}
                                            </Typography>
                                        </Box>
                                    )}

                                    {company.website && (
                                        <Link
                                            href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{ display: 'block', mb: 2 }}
                                        >
                                            {company.website.replace(/^https?:\/\//, '')}
                                        </Link>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default Companies;