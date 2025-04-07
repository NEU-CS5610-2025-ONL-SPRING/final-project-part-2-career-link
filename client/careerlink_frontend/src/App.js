import React from "react";
import Home from "./components/home/Home.jsx";
import Login from "./components/login/Login.jsx";
import { Routes, Route } from "react-router-dom";
import { RequireAuth } from "./auth/requireAuthContext.js";
import Signup from "./components/signup/Signup.jsx";
import Profile from "./components/profile/Profile.jsx";
import EmployerDashboard from "./components/employer/Dashboard.jsx";
import NavBar from "./components/navbar/NavBar.jsx"
import Companies from "./components/Companies.jsx";
import { Box } from "@mui/material";
import EmployeeDashboard from "./components/employee/Dashboard.jsx";

function App() {

  return (
    <>
      <NavBar />
      <Box
        component="main"
        sx={{
          pt: 8,
          minHeight: "100vh",
          backgroundColor: "background.default",
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/companies" element={<Companies />} />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
          <Route
            path="/employer/dashboard"
            element={
              <RequireAuth roles={["EMPLOYER"]}>
                <EmployerDashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/employee/dashboard"
            element={
              <RequireAuth roles={["JOB_SEEKER"]}>
                <EmployeeDashboard />
              </RequireAuth>
            }
          />
        </Routes>
      </Box>
    </>
  );
}

export default App;
