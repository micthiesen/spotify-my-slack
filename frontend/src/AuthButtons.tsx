import Button from "@material-ui/core/Button";
import React from "react";
import "./AuthButtons.scss";
import { getSessionData } from "./utils/auth";

const AuthButtons: React.FC = () => {
  const session = getSessionData();
  const buttons: React.ReactNode[] = [];
  if (session?.user_id) {
    buttons.push(
      <Button key="monitor-message" variant="contained" disabled>
        Your status is being monitored
      </Button>
    );
    buttons.push(
      <Button
        key="delete-account"
        variant="outlined"
        color="default"
        href="/delete-account"
      >
        Stop
      </Button>
    );
  } else {
    buttons.push(
      session?.spotify_id ? (
        <Button key="spotify-message" variant="contained" disabled>
          Spotify Connected
        </Button>
      ) : (
        <Button
          key="spotify-grant"
          variant="contained"
          color="primary"
          href="/spotify-grant"
        >
          Connect Spotify
        </Button>
      )
    );
    buttons.push(
      session?.slack_id ? (
        <Button key="slack-message" variant="contained" disabled>
          Slack Connected
        </Button>
      ) : (
        <Button
          key="slack-grant"
          variant="contained"
          color="secondary"
          href="/slack-grant"
        >
          Connect Slack
        </Button>
      )
    );
  }
  if (session?.user_id || session?.spotify_id || session?.slack_id) {
    buttons.push(
      <Button key="sign-out" variant="text" color="default" href="/sign-out">
        Sign Out
      </Button>
    );
  }

  return <div className="AuthButtons">{buttons}</div>;
};

export default AuthButtons;
