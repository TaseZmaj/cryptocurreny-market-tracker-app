import { Box, Typography, useTheme, useColorScheme } from "@mui/material";
import LightDarkModeToggle from "../features/LightDarkModeToggle.jsx";
import { Link, useLocation } from "react-router";
import { topBarHeight } from "../util/uiVars.js";
import logo from "../assets/logo_v2.png";

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
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Link to="/coins">
              <img
                src={logo}
                width={36}
                height={36}
                style={{ borderRadius: "50%", ml: "10px" }}
              ></img>
            </Link>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-end",
            }}
          >
            <Typography variant="h4" sx={{ p: "0 0 0 9px" }}>
              Cryptocurrency Market Tracker
            </Typography>
            <Box
              sx={{ height: "100%", display: "flex", alignItems: "flex-end" }}
            >
              <Typography
                variant="body1"
                sx={{ color: palette.primary.main, ml: "5px", mb: "1px" }}
                color={palette.primary.main}
              >
                v1.0
              </Typography>
            </Box>
          </Box>
        </>
      ) : null}

      <LightDarkModeToggle sx={{ ml: "auto", mr: "50px" }} />
    </Box>
  );
}

export default Navbar;
