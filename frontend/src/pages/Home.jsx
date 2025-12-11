import { Box, Button, Typography } from "@mui/material";
import { useTheme, useColorScheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router";

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
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <Typography
          variant="h2"
          sx={{
            fontSize: "4rem",
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
        color={mode === "light" ? palette.text.secondary : palette.grey[400]}
        sx={{ mt: "4px", fontSize: "1.2rem" }}
      >
        Discover and Analyze the Top Cryptocurrencies at a glance.
      </Typography>

      <Button
        variant="contained"
        sx={{
          // border: `1px solid primary.${palette.primary.main}`,
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
            fontWeight: 400,
            color: palette.common.white,
          }}
        >
          Get Started
        </Typography>
      </Button>
    </Box>
  );
}

export default Home;
