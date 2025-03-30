import React from "react";
import Home from "./components/home/Home.jsx";
import Login from "./components/login/Login.jsx";
import { Routes, Route } from "react-router-dom";
import { RequireAuth } from "./auth/requireAuthContext.js";
import Signup from "./components/signup/Signup.jsx";
import Profile from "./components/profile/Profile.jsx";
import { Button } from "@mui/material";
import { useAuthUser } from ".//auth/authContext.js";
import EmployerDashboard from "./components/employer/Dashboard.jsx";

function App() {
  const { logout } = useAuthUser();
  return (
    <>
      <Button onClick={logout}> Logout </Button>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
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
            <RequireAuth roles={['EMPLOYER']}>
              <EmployerDashboard />
            </RequireAuth>
          }
        />
      </Routes>
    </>
  );
}

export default App;
