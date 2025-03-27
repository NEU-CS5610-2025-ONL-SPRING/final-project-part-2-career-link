import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import { useAuthUser } from "../../auth/authContext";
import { useNavigate } from "react-router-dom";


export default function Login() {

  const [formData , setFormData] = useState({email : "" , password : ""});
  const { login } = useAuthUser();
  const navigate = useNavigate();


  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData.email , formData.password);
    navigate("/");
    
  }

  return (
    <Box 
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      width: "100vw",
    }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: 400, 
          p: 3,
          border: "2px solid #1976d2",
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: "white",
        }}
      >
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          margin="normal"
          required
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
}
