import React, { useState } from "react";
import { TextField, Button, Paper, Box } from "@mui/material";
import { useAuthUser } from "../../auth/authContext";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import theme from "../../theme";

const LoginBox = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(4),
}));

const LoginCard = styled(Paper)(({ theme }) => ({
  width: "400px",
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[6],
  transition: "transform 0.3s, box-shadow 0.3s",
  backgroundColor: "white",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[8],
  },
}));

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login } = useAuthUser();
  const navigate = useNavigate();

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData.email, formData.password);
    navigate("/profile");
  };

  return (
    <LoginBox>
      <LoginCard component="form" onSubmit={handleSubmit}>
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
          color="secondary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Login
        </Button>

        <Button
          onClick={() => navigate("/signup")}
          fullWidth
          variant="contained"
          color="secondary"
          sx={{
            marginTop: "15px",
            backgroundColor: "#00A300",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: theme.shadows[8],
            },
          }}
        >
          Sign Up
        </Button>
      </LoginCard>
    </LoginBox>
  );
}
