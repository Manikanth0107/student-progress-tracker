import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { FormControlLabel, Switch, useTheme } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const muiTheme = useTheme();

  return (
    <FormControlLabel
      control={
        <Switch
          checked={theme === "dark"}
          onChange={toggleTheme}
          color="primary"
        />
      }
      label={theme === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
      labelPlacement="start"
      sx={{
        ml: 2,
        color: muiTheme.palette.text.primary,
      }}
    />
  );
}

export default ThemeToggle;
