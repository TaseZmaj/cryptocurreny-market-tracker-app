import { Typography, useColorScheme, useTheme } from "@mui/material";
import { formatCryptoPrice } from "../../../util/stringUtils";
import useCoins from "../../../hooks/useCoins";

function Indicator({ data, children }) {
  const { mode } = useColorScheme();
  const { palette } = useTheme();
  const { coin } = useCoins();

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

  return (
    <Typography
      sx={{
        fontSize: "1.1rem",
        color: mode === "light" ? palette.text.primary : palette.common.white,
      }}
    >
      {children} <span></span>
      {formatCryptoPrice(data)}
      &nbsp;&nbsp;
      {status === "Bullish" ? (
        <span
          style={{
            fontWeight: "bold",
            color: palette.success.light,
          }}
        >
          Bullish
        </span>
      ) : null}
      {status === "Bearish" ? (
        <span
          style={{
            fontWeight: "bold",
            color: palette.warning.light,
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
    </Typography>
  );
}

export default Indicator;
