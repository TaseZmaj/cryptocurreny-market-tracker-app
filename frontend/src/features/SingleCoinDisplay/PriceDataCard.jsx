import {
  Box,
  Tooltip,
  Typography,
  useColorScheme,
  useTheme,
} from "@mui/material";
import useCoins from "../../hooks/useCoins";
import { formatCryptoPrice } from "../../util/stringUtils";
import InfoOutlineRoundedIcon from "@mui/icons-material/InfoOutlineRounded";
import InfoIconTooltip from "./InfoIconTooltip";

function PriceDataCard({ type }) {
  const { palette } = useTheme();
  const { mode } = useColorScheme();
  const { coin, coinLoading, coinError } = useCoins();

  return (
    <Box
      sx={{
        width: "100%",
        height: "75px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        textAlign: "center",
        borderBottom: `1px solid ${
          mode === "light" ? palette.divider : palette.common.white
        }`,
        color: mode === "light" ? palette.text.primary : palette.common.white,
        // m: "18px 0",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <Typography variant="body1">
          {type === "lastPrice24h" ? "Last Price" : null}
          {type === "highPrice24h" ? "24h High Price" : null}
          {type === "lowPrice24h" ? "24h Low Price" : null}
          {type === "volume24h" ? "24h Volume" : null}
          {type === "liquidity" ? "Liquidity" : null}
        </Typography>
        <InfoIconTooltip type={type} placement="top" sx={{ left: "0.1rem" }} />
      </Box>
      {coin && !coinLoading && !coinError ? (
        <Typography
          variant="h5"
          sx={{
            fontWeight: "600",
            fontSize: type === "lastPrice24h" && "2.1rem",
          }}
        >
          {type === "lastPrice24h" ? formatCryptoPrice(coin.lastPrice) : null}
          {type === "highPrice24h" ? formatCryptoPrice(coin.high24h) : null}
          {type === "lowPrice24h" ? formatCryptoPrice(coin.low24h) : null}
          {type === "volume24h" ? formatCryptoPrice(coin.volume24h) : null}
          {type === "liquidity" ? formatCryptoPrice(coin.liquidity24h) : null}
        </Typography>
      ) : null}
    </Box>
  );
}

export default PriceDataCard;
