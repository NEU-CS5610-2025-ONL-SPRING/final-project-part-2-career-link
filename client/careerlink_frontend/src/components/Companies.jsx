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
    Alert,
    Divider,
    useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { getAllCompanies } from '../services/companyService';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn'; 

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
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
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
                            <Card elevation={2} sx={{ height: '100%', borderRadius: 3 }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: 2 }}>
                                        <Avatar>
                                            {company.name[0]}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="h6" fontWeight={600}>
                                                {company.name}
                                            </Typography>
                                            {company.location && (
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                                                    {company.location}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>

                                    <Divider sx={{ my: 2 }} />

                                    {company.website && (
                                        <Link
                                            href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{ mb: 1, display: 'block', wordBreak: 'break-word' }}
                                        >
                                            {company.website.replace(/^https?:\/\//, '')}
                                        </Link>
                                    )}

                                    <Typography variant="body2" color="text.secondary">
                                        {company.description || 'No description available.'}
                                    </Typography>
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
