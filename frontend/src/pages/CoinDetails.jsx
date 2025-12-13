import { Box, Typography, useTheme } from "@mui/material";
import { useLocation } from "react-router-dom";
import useCoins from "../hooks/useCoins";
import { useEffect } from "react";
import LoadingTableCell from "../components/LoadingTableCell";

function CoinDetails() {
  const { palette } = useTheme();
  const { pathname } = useLocation();

  const { coin, coinError, coinLoading, getCoinById } = useCoins();

  const coinIdFromPathname = pathname.split("/").at(-1);

  useEffect(() => {
    if (!coin || String(coin.coinId) !== String(coinIdFromPathname)) {
      getCoinById(coinIdFromPathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coinIdFromPathname]);

  //Mandatory TODOS:
  //TODO: Add the full content of the page
  //TODO: EXPORT .CSV OPTION
  //TODO: Read the SRS documentation to see if you missed anything
  //TODO: Add the "There is no historic OHLCV data for this coin - page"
  //TODO: Add the Home screen error page

  //Optional TODOS:
  //TODO: Add mobile responsivity
  //TODO: Add animations

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        height: "100%",
      }}
    >
      {/* 24H DATA */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "413px",
          height: "100%",
          p: "0 30px 20px 30px",
          boxSizing: "border-box",
          // backgroundColor: palette.grey[300],
          borderRight: `1px solid ${palette.divider}`,
        }}
      >
        {/* Title and rank */}
        <Box
          sx={{
            width: "100%",
            height: "130px",
            // backgroundColor: palette.grey[400],
          }}
        >
          {coinLoading ? (
            <LoadingTableCell />
          ) : (
            <Typography variant="h3" sx={{ color: palette.text.primary }}>
              {coin.name}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            width: "100%",
            flexGrow: 1,
            backgroundColor: palette.grey[500],
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "70px",
              mt: "70px",
              backgroundColor: palette.grey[600],
            }}
          ></Box>
        </Box>

        {/* 24h data */}
      </Box>

      {/* OHLCV DATA - CHARTS */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
        }}
      >
        {/* Date selector icons */}
        <Box
          sx={{
            flexDirection: "row",
            height: "40px",
            width: "100%",
            backgroundColor: palette.grey[500],
          }}
        ></Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            p: "20px 30px",
            flexGrow: 1,
            backgroundColor: palette.grey[400],
          }}
        >
          {/* Chart 1 */}
          <Box
            sx={{
              width: "100%",
              flexGrow: 1,
              mb: "1.1rem",
              backgroundColor: palette.grey[500],
            }}
          ></Box>

          {/* Chart 2 */}
          <Box
            sx={{
              width: "100%",
              flexGrow: 1,
              mt: "1.1rem",
              backgroundColor: palette.grey[500],
            }}
          ></Box>
        </Box>
      </Box>
    </Box>
  );
}

export default CoinDetails;
