import {
  AppBar,
  Container,
  Paper,
  Toolbar,
  Typography
} from "@material-ui/core";
import React from "react";
import "./App.scss";
import AuthButtons from "./AuthButtons";
import UserSettings from "./UserSettings";
import { isAuthenticated } from "./utils/auth";

const App: React.FC = () => {
  return (
    <div className="App">
      <div className="App__backdrop"></div>
      <AppBar position="static" color="default" className="App__bar">
        <Toolbar>
          <Typography variant="h6" className="App__bar__title">
            <span>Spotify my Slack</span>
            <small>Show what's playing on Spotify as your Slack status</small>
          </Typography>
        </Toolbar>
      </AppBar>
      <Container className="App__container" maxWidth={false}>
        <Paper className="App__container__content" elevation={4}>
          <Typography className="App__container__content_h" variant="h4">
            {isAuthenticated()
              ? "Setup complete. Spotify 🔀 Slack"
              : "Connect your Spotify and Slack accounts"}
          </Typography>
          <Typography className="App__container__content_p">
            Show what's currently playing on Spotify as your Slack status. As an
            optional bonus, status emojis can be set based on the song and
            artist name.
            {isAuthenticated()
              ? null
              : " Sign in with your Spotify and Slack accounts to get started"}
          </Typography>
          <AuthButtons />
          <UserSettings />
        </Paper>
        <footer>
          <Typography align="center">
            <a
              href="https://github.com/micthiesen/spotify-my-slack"
              target="_blank"
              rel="noopener noreferrer"
            >
              Built
            </a>{" "}
            by{" "}
            <a
              href="http://www.micthiesen.ca"
              target="_blank"
              rel="noopener noreferrer"
            >
              Michael
            </a>{" "}
            ❤️
          </Typography>
        </footer>
      </Container>
    </div>
  );
};

export default App;
