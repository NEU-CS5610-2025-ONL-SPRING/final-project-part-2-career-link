import React, { useState, useEffect } from 'react';
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
import { useAuthUser } from '../../auth/authContext';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#0E0E0E',
  boxShadow: 'none',
  transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
  zIndex: theme.zIndex.drawer + 1,
  '&.scrolled': {
    backgroundColor: '#1A1A1A',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  },
}));

const Logo = styled(Link)(({ theme }) => ({
  fontWeight: 800,
  fontSize: '1.75rem',
  color: theme.palette.common.white,
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  letterSpacing: 2,
  '& span': {
    color: theme.palette.secondary.main,
    marginLeft: theme.spacing(0.5),
  },
  '&:hover': {
    color: theme.palette.secondary.light,
  },
}));

const NavButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'transparent',
  color: theme.palette.grey[100],
  fontWeight: 600,
  fontSize: '1rem',
  padding: theme.spacing(1, 2),
  borderRadius: 0,
  textTransform: 'none',
  boxShadow: 'none',
  minWidth: 'auto',
  transition: 'color 0.3s ease',
  '&:hover': {
    backgroundColor: 'transparent',
    color: theme.palette.secondary.main,
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  fontWeight: 700,
  textTransform: 'none',
  padding: theme.spacing(1.2, 2.5),
  marginLeft: theme.spacing(1),
  borderRadius: 30,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px) scale(1.02)',
    boxShadow: theme.shadows[6],
  }
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: 36,
  height: 36,
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.common.white,
  fontWeight: 600,
  fontSize: '1rem',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1)',
  },
}));

const NavBar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, isAuthenticated, logout, hasRole } = useAuthUser();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleProfileMenuOpen = (event) => setProfileAnchorEl(event.currentTarget);
  const handleProfileMenuClose = () => setProfileAnchorEl(null);

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
    navigate('/login');
  };

  return (
    <StyledAppBar position="fixed" className={scrolled ? 'scrolled' : ''}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          {/* Logo */}
          <Logo to="/">
            Career<span>Link</span>
          </Logo>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'center', gap: 2 }}>
              <NavButton component={Link} to="/">Home</NavButton>
              {isAuthenticated && hasRole('EMPLOYER') && (
                <NavButton component={Link} to="/employer/jobs">Job Postings</NavButton>
              )}
              {isAuthenticated && hasRole('JOB_SEEKER') && (
                <>
                  <NavButton component={Link} to="/employee/jobs">Browse Jobs</NavButton>
                  <NavButton component={Link} to="/employee/applications">My Applications</NavButton>
                </>
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
                    bgcolor: isAuthenticated ? theme.palette.secondary.main : 'transparent',
                    color: isAuthenticated ? 'white' : 'inherit',
                  }}>
                    {isAuthenticated ? (user?.username?.charAt(0) || user?.email?.charAt(0)) : <MenuIcon />}
                  </Avatar>
                </IconButton>

                <Menu
                  anchorEl={isAuthenticated ? profileAnchorEl : anchorEl}
                  open={Boolean(isAuthenticated ? profileAnchorEl : anchorEl)}
                  onClose={isAuthenticated ? handleProfileMenuClose : handleMenuClose}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      minWidth: 200,
                      borderRadius: 2,
                      mt: 1.5,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                    },
                  }}
                >
                  {isAuthenticated ? (
                    <>
                      <MenuItem component={Link} to="/" onClick={handleProfileMenuClose}>Home</MenuItem>
                      {hasRole('EMPLOYER') && (
                        <MenuItem component={Link} to="/employer/jobs" onClick={handleProfileMenuClose}>
                          Job Postings
                        </MenuItem>
                      )}
                      {hasRole('JOB_SEEKER') && (
                        <>
                          <MenuItem component={Link} to="/employee/jobs" onClick={handleProfileMenuClose}>
                            Browse Jobs
                          </MenuItem>
                          <MenuItem component={Link} to="/employee/applications" onClick={handleProfileMenuClose}>
                            My Applications
                          </MenuItem>
                        </>
                      )}
                      <MenuItem component={Link} to="/companies" onClick={handleProfileMenuClose}>
                        Companies
                      </MenuItem>
                      <Divider />
                      <MenuItem component={Link} to="/profile" onClick={handleProfileMenuClose}>
                        My Profile
                      </MenuItem>
                      <MenuItem onClick={handleLogout} sx={{ color: theme.palette.error.main }}>
                        Logout
                      </MenuItem>
                    </>
                  ) : (
                    <>
                      <MenuItem component={Link} to="/login" onClick={handleMenuClose}>Login</MenuItem>
                      <MenuItem component={Link} to="/signup" onClick={handleMenuClose}>Sign Up</MenuItem>
                      <Divider />
                      <MenuItem component={Link} to="/" onClick={handleMenuClose}>Home</MenuItem>
                      <MenuItem component={Link} to="/companies" onClick={handleMenuClose}>Companies</MenuItem>
                    </>
                  )}
                </Menu>
              </>
            ) : (
              <>
                {isAuthenticated ? (
                  <>
                    <Typography variant="body2" sx={{ mr: 2, color: 'white' }}>
                      {user?.email}
                    </Typography>
                    <IconButton onClick={handleProfileMenuOpen}>
                      <UserAvatar>
                        {user?.username?.charAt(0) || user?.email?.charAt(0)}
                      </UserAvatar>
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
                          mt: 1.5,
                          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                        },
                      }}
                    >
                      <MenuItem component={Link} to="/profile" onClick={handleProfileMenuClose}>
                        My Profile
                      </MenuItem>
                      <Divider />
                      <MenuItem onClick={handleLogout} sx={{ color: theme.palette.error.main }}>
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
