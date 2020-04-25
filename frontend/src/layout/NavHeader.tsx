import { H1 } from '@blueprintjs/core';
import React from 'react';
import './NavHeader.scss';

const NavHeader: React.FC = () => {
  return (
    <div className="NavHeader">
      <H1>Spotify my Slack</H1>
    </div>
  );
};

export default NavHeader;
