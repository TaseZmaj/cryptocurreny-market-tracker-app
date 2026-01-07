import { Typography, useColorScheme, useTheme } from "@mui/material";
import { formatCryptoPrice } from "../../../util/stringUtils";
import useCoins from "../../../hooks/useCoins";

function Indicator({ isCurrency = true, type, data, children, sx }) {
  const { mode } = useColorScheme();
  const { palette } = useTheme();
  const { coin } = useCoins();

  // ============= TECHNICAL INDICATORS bullish/bearish calculatios ==========
  const price = coin?.lastPrice;
  const deviation = +(price * 0.1).toFixed(8);

  //For floating point edge cases
  const EPSILON = 1e-8;

  let status = null;

  if (deviation != null) {
    if (price > data + deviation + EPSILON) status = "Bullish";
    else if (price < data - deviation - EPSILON) status = "Bearish";
    else status = "Neutral";
  }
  // =========================================================================

  return (
    <Typography
      sx={{
        fontSize: "1.05rem",
        color: mode === "light" ? palette.text.primary : palette.common.white,
        ...sx,
      }}
    >
      {children} <span></span>
      {isCurrency ? formatCryptoPrice(data) : data}
      {type === "trendIndicators" ? (
        <>
          &nbsp;&nbsp;
          {status === "Bullish" ? (
            <span
              style={{
                fontWeight: "bold",
                color: palette.success.main,
              }}
            >
              Bullish
            </span>
          ) : null}
          {status === "Bearish" ? (
            <span
              style={{
                fontWeight: "bold",
                color: palette.error.main,
              }}
            >
              Bearish
            </span>
          ) : null}
          {status === "Neutral" ? (
            <span
              style={{
                fontWeight: "bold",
                color: mode === "light" ? palette.grey[700] : palette.grey[500],
              }}
            >
              Neutral
            </span>
          ) : null}
        </>
      ) : null}
    </Typography>
  );
}

export default Indicator;
