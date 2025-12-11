import { IconButton } from "@mui/material";
import { useColorScheme, useTheme } from "@mui/material/styles";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";

function LightDarkModeToggle({ sx }) {
  const { mode, setMode } = useColorScheme();
  const { palette } = useTheme();

  return (
    <IconButton
      disableRipple
      sx={{
        ...sx,
        border: `1px solid ${
          mode === "light" ? palette.common.black : palette.common.white
        }`,
        color: mode === "light" ? palette.common.black : palette.common.white,
      }}
      onClick={() => setMode(mode === "light" ? "dark" : "light")}
    >
      {mode == "light" ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
    </IconButton>
  );
}

export default LightDarkModeToggle;
