import { Button, ButtonGroup, Card, H3 } from '@blueprintjs/core';
import React from 'react';
import './App.scss';

function App() {
  return (
    <div className="App">
      <div className="App__container">
        <Card interactive>
          <H3>Spotify my Slack</H3>
          <p>
            Show what's currently playing on Spotify as your Slack status. As an
            optional bonus, status emojis can be set based on the song and
            artist name. Sign in with your Spotify and Slack accounts to get
            started.
          </p>
          <ButtonGroup fill large>
            <Button>Connect Spotify</Button>
            <Button>Connect Slack</Button>
          </ButtonGroup>
        </Card>
      </div>
      <div className="App__footer">
        <p>
          <a href="https://github.com/micthiesen/spotify-my-slack">Built</a> by{' '}
          <a href="http://www.micthiesen.ca">Michael</a> ❤️
        </p>
      </div>
    </div>
  );
}

export default App;
