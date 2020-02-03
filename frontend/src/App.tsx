import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import React from "react";
import "./App.scss";

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

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Button variant="contained" color="primary" href="/spotify-grant">
        Connect Spotify
      </Button>
      <Button variant="contained" color="secondary" href="/slack-grant">
        Connect Slack
      </Button>
      <Button variant="text" href="/sign-out">
        Sign Out
      </Button>
    </ThemeProvider>
  );
};

export default App;
