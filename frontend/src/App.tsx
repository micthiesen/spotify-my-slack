import React from 'react';
import { Navbar, NavbarGroup, NavbarHeading } from '@blueprintjs/core';
import './App.scss';

function App() {
  return (
    <div className="App bp3-dark">
      <Navbar>
        <NavbarGroup>
          <NavbarHeading>Spotify my Slack</NavbarHeading>
        </NavbarGroup>
      </Navbar>
    </div>
  );
}

export default App;
