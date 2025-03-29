import React, { useState } from "react";

import {
  Box,
  TextField,
  Select,
  MenuItem,
  Button,
  Paper,
  InputLabel,
  FormControl,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import theme from "../../theme";

const SignupBox = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(4),
}));

const SignupCard = styled(Paper)(({ theme }) => ({
  width: "600px",
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[6],
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[8],
  },
}));

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    rePassword: "",
    role: "",
    company: "",
    newCompany: "",
    location: "",
    website: "",
  });

  const [companies, setCompanies] = useState(["Google", "Amazon", "Microsoft"]);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCompanyChange = (e) => {
    if (e.target.value === "new") {
      setFormData({ ...formData, company: "", newCompany: "" });
    } else {
      setFormData({ ...formData, company: e.target.value, newCompany: "" });
    }
  };

  const handleAddCompany = () => {
    if (formData.newCompany && !companies.includes(formData.newCompany)) {
      setCompanies([...companies, formData.newCompany]);
      setFormData({
        ...formData,
        company: formData.newCompany,
        newCompany: "",
      });
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.rePassword)
      newErrors.rePassword = "Password doesn't match";
    if (!formData.role) newErrors.role = "Role is required";
    if (formData.role === "Employer" && !formData.company) {
      newErrors.company = "Company is required";
    }
    if (formData.role === "Employer") {
      if (!formData.location) newErrors.location = "Location is required";
      if (!formData.website) newErrors.website = "Website is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    console.log("Form Submitted:", formData);
  };

  return (
    <SignupBox>
      <SignupCard>
        <Typography
          variant="h4"
          gutterBottom
          textAlign="center"
          sx={{
            fontWeight: 700,
            letterSpacing: 1,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Ready to find your dream job?
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Re-Enter Password"
            name="rePassword"
            type="password"
            value={formData.rePassword}
            onChange={handleChange}
            error={!!errors.rePassword}
            helperText={errors.rePassword}
            margin="normal"
          />
          <FormControl fullWidth margin="normal" error={!!errors.role}>
            <InputLabel>Role</InputLabel>
            <Select name="role" value={formData.role} onChange={handleChange}>
              <MenuItem value="">Select Role</MenuItem>
              <MenuItem value="Job Seeker">Job Seeker</MenuItem>
              <MenuItem value="Employer">Employer</MenuItem>
            </Select>
          </FormControl>

          {formData.role === "Employer" && (
            <>
              <FormControl fullWidth margin="normal" error={!!errors.company}>
                <InputLabel>Company Name</InputLabel>
                <Select
                  name="company"
                  value={formData.company}
                  onChange={handleCompanyChange}
                >
                  <MenuItem value="">Select Company</MenuItem>
                  {companies.map((company, index) => (
                    <MenuItem key={index} value={company}>
                      {company}
                    </MenuItem>
                  ))}
                  <MenuItem value="new">Add New Company</MenuItem>
                </Select>
              </FormControl>

              {formData.company === "" && (
                <Box display="flex" gap={2}>
                  <TextField
                    fullWidth
                    label="New Company Name"
                    name="newCompany"
                    value={formData.newCompany}
                    onChange={handleChange}
                    margin="normal"
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2, height: "56px" }}
                    onClick={handleAddCompany}
                  >
                    Add
                  </Button>
                </Box>
              )}
            </>
          )}

          {formData.role === "Employer" && (
            <>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                error={!!errors.location}
                helperText={errors.location}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                error={!!errors.website}
                helperText={errors.website}
                margin="normal"
              />
            </>
          )}

          <Button
            type="submit"
            variant="contained"
            color="secondary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Signup
          </Button>
        </form>

        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <Button
            onClick={() => navigate("/login")}
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
            Already a Member?
          </Button>
        </Box>
      </SignupCard>
    </SignupBox>
  );
};

export default Signup;
