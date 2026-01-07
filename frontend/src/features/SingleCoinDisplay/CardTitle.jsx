import { Box, Typography, useColorScheme, useTheme } from "@mui/material";
import InfoIconTooltip from "./InfoIconTooltip.jsx";
import { formatDate } from "../../util/stringUtils.js";
import useCoins from "../../hooks/useCoins.js";

//The titles for the cards of the right side of the Single Coins Page
//use this - "OHLCℹ️", "Volumeℹ️", "Trend Indicatorsℹ️", "Bollinger Bandsℹ️",...
function CardTitle({
  formattedCoinData,
  includeDate = true,
  tooltipType = "",
  children,
}) {
  const { mode } = useColorScheme();
  const { palette } = useTheme();
  const { coinLoading, coinError } = useCoins();

  return (
    <Box>
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <Typography
          variant="h5"
          sx={{
            color:
              mode === "light" ? palette.text.primary : palette.common.white,
          }}
        >
          {children}
        </Typography>
        <InfoIconTooltip
          placement="right"
          type={tooltipType}
          sx={{ top: "8px", left: "2px" }}
        />
      </Box>

      {includeDate &&
      formattedCoinData != undefined &&
      formattedCoinData.length > 0 &&
      !coinLoading &&
      !coinError ? (
        <Typography
          sx={{
            color: mode === "light" ? palette.text.primary : palette.grey[500],
          }}
        >
          {formatDate(formattedCoinData.at(0)?.date)}&nbsp;–&nbsp;
          {formatDate(formattedCoinData.at(-1)?.date)}
        </Typography>
      ) : null}
    </Box>
  );
}

export default CardTitle;
