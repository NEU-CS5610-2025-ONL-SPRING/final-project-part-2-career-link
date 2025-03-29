import React from "react";
import Home from "./components/home/Home";
import Login from "./components/login/Login";
import { Routes, Route } from "react-router-dom";
import { RequireAuth } from "./auth/requireAuthContext";
import Signup from "./components/signup/Signup";
import Profile from "./components/profile/Profile";
import { Button } from "@mui/material";
import { useAuthUser } from ".//auth/authContext";

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
      </Routes>
    </>
  );
}

export default App;
