import { Tooltip, useTheme } from "@mui/material";
import useCoins from "../../hooks/useCoins";
import InfoOutlineRoundedIcon from "@mui/icons-material/InfoOutlineRounded";

function InfoIconTooltip({ placement = "bottom", type, sx }) {
  const { palette } = useTheme();
  const { coin } = useCoins();

  const typeMessages = {
    quoteAsset: `The quote asset is the currency used to price or buy the base asset — in this case, ${coin?.quoteAsset}`,
    status:
      "This indicates the current operational state of the coin or trading pair, e.g., whether it’s active or inactive. ",
    lastPrice24h:
      "The most recent trading price of the coin within the last 24 hours.",
    highPrice24h:
      "The highest price the coin reached during the past 24 hours.",
    lowPrice24h: "The lowest price the coin reached during the past 24 hours.",
    volume24h:
      "The total amount of the coin traded across markets in the last 24 hours.",
    liquidity:
      "An estimate of how easily the coin can be bought or sold without significantly affecting its price.",
    ChartOHLC:
      "Displays the key price movements for a time period, marking the opening, closing, highest, and lowest prices reached.",
    ChartVolume:
      "Shows the total quantity of assets traded during each time period, indicating the intensity of market activity.",
    TrendIndicators:
      "Trend indicators use moving averages to show the general direction of price movement over time, helping traders distinguish between upward, downward, and sideways trends.",
  };

  return (
    <Tooltip title={typeMessages[type]} placement={placement}>
      <InfoOutlineRoundedIcon
        sx={{
          fontSize: "1rem",
          color: palette.primary.light,
          position: "relative",
          top: "3px",
          left: "0.01rem",
          ...sx,
        }}
      />
    </Tooltip>
  );
}

export default InfoIconTooltip;
