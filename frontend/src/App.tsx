import { Navbar, NavbarGroup, NavbarHeading } from '@blueprintjs/core';
import React from 'react';
import './App.scss';

function App() {
  return (
    <div className="App">
      <Navbar>
        <NavbarGroup>
          <NavbarHeading>Spotify my Slack</NavbarHeading>
        </NavbarGroup>
      </Navbar>
    </div>
  );
}

export default App;
