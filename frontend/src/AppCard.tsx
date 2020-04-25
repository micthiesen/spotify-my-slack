import { Button, ButtonGroup, Card, H3 } from '@blueprintjs/core';
import React from 'react';
import './AppCard.scss';

const MainCard: React.FC = () => {
  return (
    <div className="MainCard">
      <Card>
        <H3>Spotify my Slack</H3>
        <p>
          Show what's currently playing on Spotify as your Slack status. As an
          optional bonus, status emojis can be set based on the song and artist
          name. Sign in with your Spotify and Slack accounts to get started.
        </p>
        <ButtonGroup fill large>
          <Button intent="success">Connect Spotify</Button>
          <Button intent="warning">Connect Slack</Button>
        </ButtonGroup>
      </Card>
    </div>
  );
};

export default MainCard;
