import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography
} from "@material-ui/core";
import React, { useState } from "react";
import { isAuthenticated } from "./utils/auth";

const UserSettings: React.FC = () => {
  const [state, setState] = useState({ useCustomEmojis: false });
  const handleChange = (name: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState({ ...state, [name]: event.target.checked });
  };

  if (!isAuthenticated()) {
    return null;
  }

  return (
    <div className="UserSettings">
      <Typography variant="h5">Preferences</Typography>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={state.useCustomEmojis}
              onChange={handleChange("useCustomEmojis")}
              value="useCustomEmojis"
            />
          }
          label="Set status emojis based on song and artist name 👉🥰🎉"
        />
      </FormGroup>
    </div>
  );
};

export default UserSettings;
