import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      dark: "#1565c0",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#f50057",
    },
    background: {
      default: "#f4f4f4",
    },
  },
});

export default theme;
