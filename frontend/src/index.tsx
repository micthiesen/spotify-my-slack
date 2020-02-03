import { createMuiTheme, CssBaseline, ThemeProvider } from "@material-ui/core";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.scss";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#1db954", // Spotify green
      contrastText: "#ffffff"
    },
    secondary: {
      main: "#ecb22e", // Slack orange
      contrastText: "#ffffff"
    },
    error: {
      main: "#e01e5a", // Slack red
      contrastText: "#ffffff"
    },
    warning: {
      main: "#ecb22e", // Slack orange
      contrastText: "#ffffff"
    },
    info: {
      main: "#36c5f0", // Slack blue
      contrastText: "#ffffff"
    },
    success: {
      main: "#1db954", // Spotify green
      contrastText: "#ffffff"
    },
    text: {
      primary: "#424242"
    }
  },
  overrides: {
    MuiButton: {
      root: {
        borderRadius: "2px"
      }
    }
  },
  props: {
    MuiButton: {
      disableElevation: true
    }
  }
});

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>,
  document.getElementById("root")
);
