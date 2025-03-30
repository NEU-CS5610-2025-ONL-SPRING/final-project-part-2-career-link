import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import reportWebVitals from "./reportWebVitals.js";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/authContext.js";
import theme from "./theme.js";
import { ThemeProvider } from "@emotion/react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <App/>
      </ThemeProvider>
    </BrowserRouter>
  </AuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
