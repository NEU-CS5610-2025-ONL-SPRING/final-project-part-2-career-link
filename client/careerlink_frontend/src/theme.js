import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2A4D8C", // A darker, more sophisticated shade of blue
      dark: "#1C3A6D", // A more subtle dark shade
      contrastText: "#ffffff", // Keeps text white on the primary background
    },
    secondary: {
      main: "#D24F75", // Muted rose pink for secondary accent
    },
    background: {
      default: "#f7f7f7", // Lighter background color for a cleaner, minimal look
    },
    text: {
      primary: "#333333", // Darker primary text for better readability
      secondary: "#555555", // Softer secondary text
    },
  },
  typography: {
    fontFamily: '"Montserrat", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: "3.5rem", // Slightly bigger headings for impact
    },
    h2: {
      fontWeight: 700,
      fontSize: "2.5rem",
    },
    h3: {
      fontWeight: 600,
      fontSize: "2rem",
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.5rem",
    },
    h5: {
      fontWeight: 500,
      fontSize: "1.2rem",
    },
    h6: {
      fontWeight: 400,
      fontSize: "1rem",
    },
    body1: {
      fontWeight: 400,
      fontSize: "1rem",
      lineHeight: 1.6,
    },
    body2: {
      fontWeight: 400,
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },
  },
});

export default theme;
