import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Typography,
  useMediaQuery,
  useTheme,
  styled
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuthUser } from "../../auth/authContext";

// Styled Components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backdropFilter: 'blur(6px)',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  boxShadow: 'none',
  transition: 'all 0.3s ease',
  zIndex: theme.zIndex.drawer + 1,
  '&.scrolled': {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
  }
}));

const Logo = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  letterSpacing: 1,
  color: theme.palette.common.white,
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  '& span': {
    color: theme.palette.secondary.main,
    marginLeft: theme.spacing(0.5)
  }
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: theme.palette.common.white,
  fontWeight: 500,
  textTransform: 'none',
  fontSize: '1rem',
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: 'translateY(-2px)'
  }
}));

const ActionButton = styled(Button)(({ theme }) => ({
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1, 2.5),
  marginLeft: theme.spacing(1),
  boxShadow: theme.shadows[2],
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4]
  }
}));

const NavBar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, isAuthenticated, logout, hasRole } = useAuthUser();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  // Get dashboard path based on user role
  const getDashboardPath = () => {
    return hasRole('EMPLOYER') ? '/employer/dashboard' : '/employee/dashboard';
  };

  // Handle scroll effect
  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileMenuOpen = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
    navigate('/login');
  };

  return (
    <StyledAppBar position="fixed" className={scrolled ? 'scrolled' : ''}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo */}
          <Box sx={{ flexGrow: isMobile ? 1 : 0 }}>
            <Logo
              variant="h6"
              component={Link}
              to="/"
              sx={{
                fontSize: isMobile ? '1.25rem' : '1.5rem'
              }}
            >
              Career<span>Link</span>
            </Logo>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              flexGrow: 1,
              gap: 1
            }}>
              <NavButton component={Link} to="/">Home</NavButton>
              {isAuthenticated && (
                <NavButton component={Link} to={getDashboardPath()}>Dashboard</NavButton>
              )}
              <NavButton component={Link} to="/companies">Companies</NavButton>

            </Box>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isMobile ? (
              <>
                <IconButton
                  size="large"
                  edge="end"
                  onClick={isAuthenticated ? handleProfileMenuOpen : handleMenuOpen}
                  color="inherit"
                  sx={{ ml: 1 }}
                >
                  <Avatar sx={{
                    width: 32,
                    height: 32,
                    bgcolor: isAuthenticated ? theme.palette.secondary.main : 'transparent'
                  }}>
                    {isAuthenticated ? (user?.username?.charAt(0) || user?.email?.charAt(0)) : <MenuIcon />}
                  </Avatar>
                </IconButton>

                {isAuthenticated ? (
                  <Menu
                    anchorEl={profileAnchorEl}
                    open={Boolean(profileAnchorEl)}
                    onClose={handleProfileMenuClose}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        minWidth: 200,
                        borderRadius: 2,
                        boxShadow: theme.shadows[8],
                        mt: 1.5,
                      },
                    }}
                  >
                    <MenuItem
                      component={Link}
                      to="/profile"
                      onClick={handleProfileMenuClose}
                      sx={{ py: 1.5 }}
                    >
                      My Profile
                    </MenuItem>
                    <Divider />
                    <MenuItem
                      onClick={handleLogout}
                      sx={{ py: 1.5, color: theme.palette.error.main }}
                    >
                      Logout
                    </MenuItem>
                  </Menu>
                ) : (
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        minWidth: 200,
                        borderRadius: 2,
                        boxShadow: theme.shadows[8],
                        mt: 1.5,
                      },
                    }}
                  >
                    <MenuItem
                      component={Link}
                      to="/login"
                      onClick={handleMenuClose}
                      sx={{ py: 1.5 }}
                    >
                      Login
                    </MenuItem>
                    <MenuItem
                      component={Link}
                      to="/signup"
                      onClick={handleMenuClose}
                      sx={{ py: 1.5 }}
                    >
                      Sign Up
                    </MenuItem>
                    <Divider />
                    <MenuItem component={Link} to="/" onClick={handleMenuClose}>Home</MenuItem>
                    <MenuItem component={Link} to="/companies" onClick={handleMenuClose}>Companies</MenuItem>
                  </Menu>
                )}
              </>
            ) : (
              <>
                {isAuthenticated ? (
                  <>
                    <Typography variant="body2" sx={{ mr: 2, color: 'white' }}>
                      {user?.email}
                    </Typography>
                    <IconButton
                      onClick={handleProfileMenuOpen}
                      sx={{ ml: 1 }}
                    >
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: theme.palette.secondary.main
                        }}
                      >
                        {user?.username?.charAt(0) || user?.email?.charAt(0)}
                      </Avatar>
                    </IconButton>
                    <Menu
                      anchorEl={profileAnchorEl}
                      open={Boolean(profileAnchorEl)}
                      onClose={handleProfileMenuClose}
                      PaperProps={{
                        elevation: 0,
                        sx: {
                          minWidth: 200,
                          borderRadius: 2,
                          boxShadow: theme.shadows[8],
                          mt: 1.5,
                        },
                      }}
                    >
                      <MenuItem
                        component={Link}
                        to="/profile"
                        onClick={handleProfileMenuClose}
                        sx={{ py: 1.5 }}
                      >
                        My Profile
                      </MenuItem>
                      <Divider />
                      <MenuItem
                        onClick={handleLogout}
                        sx={{ py: 1.5, color: theme.palette.error.main }}
                      >
                        Logout
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <>
                    <ActionButton
                      component={Link}
                      to="/login"
                      variant="outlined"
                      color="inherit"
                      sx={{ mr: 1 }}
                    >
                      Login
                    </ActionButton>
                    <ActionButton
                      component={Link}
                      to="/signup"
                      variant="contained"
                      color="secondary"
                    >
                      Sign Up
                    </ActionButton>
                  </>
                )}
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
};

export default NavBar;