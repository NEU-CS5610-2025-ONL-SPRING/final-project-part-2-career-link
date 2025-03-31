import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuthUser } from "../../auth/authContext";

export default function Navbar() {
  const { user, logout } = useAuthUser();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}
        >
          Home
        </Typography>

        {user && (
          <Button
            component={Link}
            to={
              user.role.toLowerCase() === "employer"
                ? "/employer/dashboard"
                : "/employee/dashboard"
            }
            color="inherit"
          >
            Dashboard
          </Button>
        )}

        {
          user ? (
          <Button component={Link} to="/profile" color="inherit">
            Profile
          </Button>
          ) :
          ""
        }

        <Box sx={{ marginLeft: "auto" }}>
          {user ? (
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          ) : (
            <Button component={Link} to="/login" color="inherit">
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
