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
            <Link to="/coins" style={{ marginTop: "2px" }}>
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
              minWidth: 0,
            }}
          >
            <Link to="/coins" style={{ textDecoration: "none" }}>
              <Typography
                variant="h4"
                sx={{
                  fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2rem" },
                  p: "0 0 0 9px",
                  color:
                    mode === "light"
                      ? palette.text.primary
                      : palette.common.white,
                }}
              >
                Cryptocurrency Market Tracker
                <Box
                  component="span"
                  sx={{
                    color: palette.primary.main,
                    fontSize: "1rem",
                    marginLeft: "5px",
                    marginRight: "5px",
                    whiteSpace: "nowrap",
                    verticalAlign: "baseline",
                  }}
                >
                  v1.0
                </Box>
              </Typography>
            </Link>
          </Box>
        </>
      ) : null}

      <LightDarkModeToggle sx={{ ml: "auto", mr: { xs: "2px", lg: "30px" } }} />
    </Box>
  );
}

export default Navbar;
