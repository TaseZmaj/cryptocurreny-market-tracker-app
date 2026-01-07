import { Box, Typography, useColorScheme, useTheme } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";

function RsiProgressBar({ value }) {
  const { mode } = useColorScheme();
  const { palette } = useTheme();

  // ================ RSI Bullish/Bearish display logic ===============

  function rsiDisplay(rsi) {
    switch (true) {
      case rsi >= 70:
        return { marketState: "Overbought", color: palette.error.main };
      case rsi >= 60:
        return { marketState: "Bullish", color: palette.error.light };
      case rsi >= 40:
        return {
          marketState: "Neutral",
          color: mode === "light" ? palette.grey[700] : palette.grey[500],
        };
      case rsi >= 30:
        return { marketState: "Bearish", color: palette.success.light };
      default:
        return { marketState: "Oversold", color: palette.success.main };
    }
  }

  const rsiProgressDisplay = rsiDisplay(value);
  // ==================================================================

  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          mb: "10px",
        }}
      >
        <Typography
          sx={{
            fontSize: "1.05rem",
            fontWeight: "bold",
            color: rsiProgressDisplay.color,
          }}
        >
          {value.toFixed(2)}
        </Typography>
        <LinearProgress
          sx={{
            flexGrow: 1,
            height: "30px",
            width: "100%",
            borderRadius: "4px",
            backgroundColor: palette.grey[200],
            "& .MuiLinearProgress-bar": {
              backgroundColor: rsiProgressDisplay.color,
            },
          }}
          value={value}
          variant="determinate"
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "flex-end",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: "1.1rem",
            pl: "7px",
            pt: "10px",
            fontWeight: "bold",
            color: rsiProgressDisplay.color,
          }}
        >
          {rsiProgressDisplay.marketState}
        </Typography>
      </Box>
    </Box>
  );
}

export default RsiProgressBar;
