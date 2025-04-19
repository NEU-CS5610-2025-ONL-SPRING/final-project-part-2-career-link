import React from "react";
import { Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";

import Home from "./components/home/Home.jsx";
import Login from "./components/login/Login.jsx";
import Signup from "./components/signup/Signup.jsx";
import Profile from "./components/profile/Profile.jsx";
import NavBar from "./components/navbar/NavBar.jsx";
import Companies from "./components/Companies.jsx";
import BrowseJobs from "./components/employee/BrowseJobs.jsx";
import MyApplications from "./components/employee/MyApplications.jsx";
import JobPostings from "./components/employer/JobPostings.jsx";
import Applications from "./components/employer/Applications.jsx";
import CandidateProfileView from "./components/profile/CandidateProfileView.jsx";

import { RequireAuth } from "./auth/requireAuthContext.js";

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
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/companies" element={<Companies />} />

          {/* Protected Profile Route (All Roles) */}
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />

          {/* JOB_SEEKER Routes */}
          <Route
            path="/employee/jobs"
            element={
              <RequireAuth roles={["JOB_SEEKER"]}>
                <BrowseJobs />
              </RequireAuth>
            }
          />
          <Route
            path="/employee/applications"
            element={
              <RequireAuth roles={["JOB_SEEKER"]}>
                <MyApplications />
              </RequireAuth>
            }
          />

          {/* EMPLOYER Routes */}
          <Route
            path="/employer/jobs"
            element={
              <RequireAuth roles={["EMPLOYER"]}>
                <JobPostings />
              </RequireAuth>
            }
          />
          <Route
            path="/employer/applications"
            element={
              <RequireAuth roles={["EMPLOYER"]}>
                <Applications />
              </RequireAuth>
            }
          />
          <Route
            path="/candidates/:employeeId"
            element={
              <RequireAuth roles={["EMPLOYER"]}>
                <CandidateProfileView />
              </RequireAuth>
            }
          />
        </Routes>
      </Box>
    </>
  );
}

export default App;
