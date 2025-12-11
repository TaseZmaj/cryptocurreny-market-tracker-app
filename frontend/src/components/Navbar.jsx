import { Box, Typography, useTheme, useColorScheme } from "@mui/material";
import LightDarkModeToggle from "../features/LightDarkModeToggle.jsx";
import { useLocation } from "react-router";
import { topBarHeight } from "../util/uiVars.js";

function Navbar({ title = "true", sx }) {
  const { palette } = useTheme();
  const { mode } = useColorScheme();
  const { pathname } = useLocation();

  return (
    <Box
      as="nav"
      sx={{
        width: "100%",
        height: topBarHeight,
        boxSizing: "border-box",
        bgcolor:
          pathname === "/"
            ? "transparent"
            : mode === "light"
            ? palette.common.white
            : palette.background.dark,
        color: mode === "light" ? palette.text.primary : palette.common.white,
        p: 2,
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        position: pathname === "/" && "fixed",
        ...sx,
      }}
    >
      {title === "true" ? (
        <Box
          sx={{ display: "flex", flexDirection: "row", alignItems: "flex-end" }}
        >
          <Typography variant="h4" sx={{ p: "0 0 0 18px" }}>
            Cryptocurrency Market Tracker
          </Typography>
          <Box sx={{ height: "100%", display: "flex", alignItems: "flex-end" }}>
            <Typography
              variant="body1"
              sx={{ color: palette.primary.main, ml: "5px", mb: "1px" }}
              color={palette.primary.main}
            >
              v1.0
            </Typography>
          </Box>
        </Box>
      ) : null}

      <LightDarkModeToggle sx={{ ml: "auto", mr: "50px" }} />
    </Box>
  );
}

export default Navbar;
