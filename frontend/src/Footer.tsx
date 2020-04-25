import React from "react";
import "./Footer.scss";

const Footer: React.FC = () => {
  return (
    <div className="Footer">
      <p>
        <a href="https://github.com/micthiesen/spotify-my-slack">Built</a> by{" "}
        <a href="https://thiesen.dev">Michael</a> ❤️
      </p>
    </div>
  );
};

export default Footer;
