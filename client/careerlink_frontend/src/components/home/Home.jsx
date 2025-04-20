import React from 'react';
import {
    Box,
    Button,
    Container,
    Typography,
    Grid,
    Paper,
    useTheme,
    useMediaQuery,
    Fade,
    Slide
} from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { useAuthUser } from "../../auth/authContext";

const HeroBox = styled(Box)(({ theme }) => ({
    minHeight: 'calc(100vh - 64px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: `linear-gradient(145deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    color: theme.palette.primary.contrastText,
    padding: theme.spacing(8, 0),
    position: 'relative',
    overflow: 'hidden',
    textAlign: 'center',
    '&:before': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '150px',
        background: theme.palette.background.default,
        clipPath: 'polygon(0 100%, 100% 100%, 100% 0)',
    }
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    height: '100%',
    borderRadius: '12px',
    boxShadow: theme.shadows[4],
    transition: 'transform 0.3s, box-shadow 0.3s, background-color 0.3s',
    '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: theme.shadows[10],
        backgroundColor: theme.palette.grey[50],
    },
}));

const Home = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { isAuthenticated, user } = useAuthUser();

    return (
        <Box sx={{ bgcolor: 'background.default' }}>
            {/* Hero Section */}
            <HeroBox>
                <Container maxWidth="md">
                    <Fade in timeout={1000}>
                        <Box>
                            {isAuthenticated ? (
                                <Typography
                                    variant={isMobile ? 'h4' : 'h2'}
                                    component="h1"
                                    gutterBottom
                                    sx={{
                                        fontWeight: 700,
                                        mb: 3,
                                        fontSize: isMobile ? '2rem' : '3rem',
                                        color: theme.palette.secondary.main,
                                    }}
                                >
                                    Welcome back, {user?.username}!
                                </Typography>
                            ) : (
                                <Typography
                                    variant={isMobile ? 'h4' : 'h2'}
                                    component="h1"
                                    gutterBottom
                                    sx={{
                                        fontWeight: 700,
                                        mb: 3,
                                        fontSize: isMobile ? '2rem' : '3rem',
                                        color: theme.palette.secondary.main,
                                    }}
                                >
                                    Welcome to <span style={{ color: theme.palette.secondary.main }}>CareerLink</span>
                                </Typography>
                            )}
                            <Typography
                                variant={isMobile ? 'h6' : 'h5'}
                                component="p"
                                gutterBottom
                                sx={{
                                    mb: 4,
                                    opacity: 0.9,
                                    color: theme.palette.primary.contrastText
                                }}
                            >
                                {isAuthenticated
                                    ? "You're all set to explore new opportunities."
                                    : "The ultimate platform connecting top talent with leading employers"}
                            </Typography>
                        </Box>
                    </Fade>
                </Container>
            </HeroBox>

            {/* Features Section */}
            <Container maxWidth="lg" sx={{ py: 10, position: 'relative' }}>
                <Typography
                    variant="h3"
                    component="h2"
                    align="center"
                    gutterBottom
                    sx={{
                        fontWeight: 600,
                        mb: 8,
                        color: theme.palette.text.primary
                    }}
                >
                    Why Choose <span style={{ color: theme.palette.primary.main }}>CareerLink</span>?
                </Typography>
                <Grid container spacing={4} justifyContent="center" wrap="wrap">
                    {[{
                        title: "For Job Seekers",
                        items: [
                            "Advanced job search with smart filters",
                            "Application tracking dashboard",
                            "Personalized job recommendations",
                            "Skill-based profile matching"
                        ],
                        icon: "🔍"
                    },
                    {
                        title: "For Employers",
                        items: [
                            "AI-powered candidate matching",
                            "Streamlined application management",
                            "Employer branding tools",
                            "Detailed analytics dashboard"
                        ],
                        icon: "💼"
                    },
                    {
                        title: "Our Advantages",
                        items: [
                            "Secure encrypted platform",
                            "Mobile-friendly interface",
                            "24/7 customer support",
                            "Trusted by 10,000+ companies"
                        ],
                        icon: "✨"
                    }].map((feature, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Slide direction="up" in timeout={(index + 1) * 300}>
                                <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                                    <FeatureCard elevation={4}>
                                        <Typography
                                            variant="h4"
                                            component="h3"
                                            gutterBottom
                                            sx={{
                                                fontWeight: 600,
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 2,
                                                color: theme.palette.primary.main,
                                            }}
                                        >
                                            {feature.icon} {feature.title}
                                        </Typography>
                                        <Box component="ul" sx={{ pl: 2 }}>
                                            {feature.items.map((item, i) => (
                                                <Typography
                                                    key={i}
                                                    component="li"
                                                    variant="body1"
                                                    sx={{
                                                        mb: 1.5,
                                                        '&:before': {
                                                            content: '"•"',
                                                            color: theme.palette.secondary.main,
                                                            mr: 1
                                                        }
                                                    }}
                                                >
                                                    {item}
                                                </Typography>
                                            ))}
                                        </Box>
                                    </FeatureCard>
                                </Box>
                            </Slide>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Stats Section */}
            <Box sx={{
                py: 10,
                background: `linear-gradient(to right, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`,
                color: theme.palette.getContrastText(theme.palette.primary.light)
            }}>
                <Container maxWidth="lg">
                    <Grid container spacing={4} justifyContent="center">
                        {[{
                            value: "10,000+", label: "Active Jobs"
                        },
                        {
                            value: "50,000+", label: "Job Seekers"
                        },
                        {
                            value: "5,000+", label: "Companies"
                        },
                        {
                            value: "95%", label: "Satisfaction Rate"
                        }].map((stat, index) => (
                            <Grid item xs={6} sm={3} key={index}>
                                <Box textAlign="center">
                                    <Typography variant="h3" component="div" sx={{ fontWeight: 700 }}>
                                        {stat.value}
                                    </Typography>
                                    <Typography variant="h6" component="div">
                                        {stat.label}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* CTA Section */}
            <Box sx={{ py: 12, position: 'relative' }}>
                <Container maxWidth="md">
                    <Box
                        sx={{
                            p: 6,
                            borderRadius: 4,
                            background: theme.palette.background.paper,
                            boxShadow: theme.shadows[10],
                            textAlign: 'center'
                        }}
                    >
                        <Typography
                            variant="h3"
                            component="h2"
                            gutterBottom
                            sx={{ fontWeight: 700 }}
                        >
                            Ready to transform your career?
                        </Typography>
                        <Typography
                            variant="h6"
                            component="p"
                            gutterBottom
                            sx={{ mb: 4, opacity: 0.9 }}
                        >
                            Join our community today and take the next step in your professional journey.
                        </Typography>
                        <Button
                            component={Link}
                            to={
                                isAuthenticated
                                    ? user?.role === "JOB_SEEKER"
                                        ? "/employee/jobs"
                                        : "/employer/jobs"
                                    : "/signup"
                            }
                            variant="contained"
                            color="primary"
                            size="large"
                            sx={{
                                px: 6,
                                py: 1.5,
                                borderRadius: 2,
                                fontWeight: 600,
                                fontSize: '1.1rem',
                                textTransform: 'uppercase',
                            }}
                        >
                            {isAuthenticated
                                ? user?.role === "JOB_SEEKER"
                                    ? "Browse Jobs"
                                    : "Job Postings"
                                : "Get Started Now"}
                        </Button>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default Home;
