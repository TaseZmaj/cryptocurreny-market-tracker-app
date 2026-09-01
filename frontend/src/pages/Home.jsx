import { Box, Button, Typography } from "@mui/material";
import { useTheme, useColorScheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router";
import logo from "../assets/logo_v2.png";

function Home() {
  const { mode } = useColorScheme();
  const { palette } = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        flexGrow: 1,
        width: "100%",
        height: "100%",
        bgcolor:
          mode === "light" ? palette.common.white : palette.background.dark,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        component="img"
        src={logo}
        alt=""
        aria-hidden="true"
        sx={{
          position: "absolute",
          // top: 115,
          width: {
            xs: "min(88vw, 360px)",
            sm: "min(70vw, 520px)",
            lg: "620px",
          },
          height: "auto",
          opacity: mode === "light" ? 0.075 : 0.065,
          pointerEvents: "none",
          userSelect: "none",
        }}
      />

      <Box sx={{ display: "flex", flexDirection: "row", position: "relative" }}>
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "2.6rem", md: "3.5rem", lg: "4rem" },
            color:
              mode === "light" ? palette.text.primary : palette.common.white,
          }}
        >
          Cryptocurrency Market Tracker
        </Typography>
        {/* This is the version "V1.0", I didn't like how it looked */}
        {/* <Box sx={{ display: "flex", alignItems: "flex-end" }}>
          <Typography
            variant="body1"
            sx={{ color: palette.primary.main, mb: "10px", ml: "5px" }}
            color={palette.primary.main}
          >
            v1.0
          </Typography>
        </Box> */}
      </Box>

      <Typography
        variant="body1"
        color={mode === "light" ? palette.grey[600] : palette.grey[400]}
        sx={{
          fontWeight: 100,
          mt: "6px",
          fontSize: { xs: "1.12rem", md: "1.2rem", lg: "1.3rem" },
          position: "relative",
        }}
      >
        Discover and Analyze the Top Cryptocurrencies at a glance.
      </Typography>

      <Button
        variant="contained"
        sx={{
          // border: `1px solid primary.${palette.primary.main}`,
          position: "relative",
          mt: 6,
          pt: 1.3,
          pb: 1.3,
          "&:hover": {},
        }}
        onClick={() => navigate("/coins")}
        disableElevation
        disableRipple
        disableFocusRipple
      >
        <Typography
          sx={{
            fontSize: "1.3rem",
            fontWeight: 500,
            color: "#fcfbfbf3",
          }}
        >
          Get Started
        </Typography>
      </Button>
    </Box>
  );
}

export default Home;
