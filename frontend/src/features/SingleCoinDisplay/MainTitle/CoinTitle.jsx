import { useColorScheme, useTheme, Box, Typography } from "@mui/material";
import {
  getSymbolFontSize,
  getTitleFontSize,
} from "../../../util/stringUtils.js";
import useCoins from "../../../hooks/useCoins";
import RankTag from "./RankTag.jsx";
import LoadingSkeleton from "../../../components/LoadingSkeleton.jsx";

function CoinTitle({ wrapped, titleRef }) {
  const { mode } = useColorScheme();
  const { palette } = useTheme();

  const { coin, coinLoading, coinError } = useCoins();

  return (
    <>
      {coin && !coinLoading && !coinError ? (
        <>
          <img
            src={coin.coinIconUrl}
            alt={coin.name}
            width={56}
            height={56}
            style={{
              borderRadius: "50%",
              paddingRight: "10px",
            }}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row", md: "row" },
              alignItems: wrapped ? "center" : "baseline",
              pt: "10px",
              minWidth: 0,
              textAlign: { xs: "center", md: "left" },
              // containerType: "inline-size",
            }}
          >
            <Typography
              ref={titleRef}
              variant="h3"
              sx={{
                wordBreak: "break-word",
                whiteSpace: "normal",
                maxWidth: "100%",
                color:
                  mode === "light"
                    ? palette.text.primary
                    : palette.common.white,
                fontSize: wrapped
                  ? `calc(${getTitleFontSize(coin.name)} * 1.2)`
                  : "clamp(1rem, 9cqw, 2.5rem)",
                lineHeight: 1,
                p: { xs: "0 0 4px 0" },
              }}
            >
              {coin.name}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: "1.3rem", md: getSymbolFontSize(coin.symbol) },
                whiteSpace: "nowrap",
                color:
                  mode === "light" ? palette.text.secondary : palette.grey[300],
                m: "0 4px",
                lineHeight: 1,
                // p: { xs: "0 0 10px 0", sm: "" },
              }}
            >
              {coin.symbol}
            </Typography>
            <RankTag
              coin={coin}
              sx={{
                margin: { sx: "20px 0 auto 4px", sm: "auto 0 auto 4px" },
                mt: { xs: "8px", sm: "auto" },
              }}
            />
          </Box>
        </>
      ) : null}

      {coinLoading && !coinError ? (
        <>
          <Box sx={{ width: 56, height: 56 }}>
            <LoadingSkeleton
              sx={{ width: 56, height: "56px !important", borderRadius: "50%" }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: wrapped ? "center" : "baseline",
              pt: "10px",
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                width: "150px",
                height: { xs: "50px", md: "30px" },
                margin: "10px 0 0 10px",
              }}
            >
              <LoadingSkeleton sx={{ width: "100%" }} />
            </Box>
            <Box
              sx={{ width: "40px", height: "30px", margin: "10px 0 0 10px" }}
            >
              <LoadingSkeleton sx={{ width: "100%" }} />
            </Box>
            <Box
              sx={{
                ml: "6px",
                mt: "auto",
                mb: wrapped ? "auto" : "0",
                width: "45px",
                height: "30px",
                margin: "10px 0 0 10px",
              }}
            >
              <LoadingSkeleton sx={{ width: "100%", borderRadius: "4" }} />
            </Box>
          </Box>
        </>
      ) : null}
    </>
  );
}

export default CoinTitle;
