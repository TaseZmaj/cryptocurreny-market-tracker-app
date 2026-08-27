import {
  Box,
  Tooltip,
  Typography,
  useColorScheme,
  useTheme,
} from "@mui/material";
import { darkBackgroundColor } from "../../../util/uiVars";
import useCoins from "../../../hooks/useCoins";

//This is the used for the display of the Market Cap Rank of the coin
function RankTag({ sx }) {
  const { mode } = useColorScheme();
  const { palette } = useTheme();
  const { coin } = useCoins();

  return (
    <Tooltip
      title={`${coin.name} - ${coin.symbol}'s Market Cap Rank. `}
      enterDelay={150}
    >
      <Box
        sx={{
          minWidth: "25px",
          height: { xs: "35px", md: "25px" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor:
            mode === "light" ? darkBackgroundColor : palette.grey[900],
          color: palette.common.white,
          boxSizing: "border-box",
          border: `1px solid ${mode === palette.grey[500]}`,
          borderRadius: "4px",
          p: "0 13px",
          ...sx,
        }}
      >
        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: "1.1rem", md: "1rem" },
            fontWeight: { xs: "600", md: "400" },
          }}
        >
          #{coin.marketCapRank}
        </Typography>
      </Box>
    </Tooltip>
  );
}

export default RankTag;
