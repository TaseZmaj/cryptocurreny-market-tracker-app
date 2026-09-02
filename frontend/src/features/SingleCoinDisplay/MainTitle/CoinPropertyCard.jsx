import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  useColorScheme,
  useTheme,
} from "@mui/material";
import InfoIconTooltip from "../InfoIconTooltip";
import useCoins from "../../../hooks/useCoins";
import LoadingSkeleton from "../../../components/LoadingSkeleton";

// These are used for the "Quote Asset: USD" and "Status: Active"
// on the Single Coin Page
export default function CoinPropertyCard({
  type,
  wrapped = false,
  children,
  ...sx
}) {
  const { mode } = useColorScheme();
  const { palette } = useTheme();

  const { coin, coinLoading, coinError } = useCoins();

  return (
    <>
      {coin && !coinLoading && !coinError ? (
        <Box
          sx={{
            display: "flex",
            alignItems: wrapped ? "center" : "baseline",
            p: { xs: "5px 13px", md: "9px 13px" },
            color:
              mode === "light" ? palette.text.primary : palette.common.white,
            // border: "1px solid black",
            ...sx,
          }}
        >
          <Typography sx={{ fontSize: "1.1rem" }}>
            {type === "quoteAsset" ? "Quote Asset:" : null}
            {type === "status" ? "Status:" : null}
          </Typography>
          <Box sx={{ height: "100%", display: "flex", flexDirection: "row" }}>
            <InfoIconTooltip type={type} />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ml: "6px",
                boxSizing: "border-box",
                width: type === "quoteAsset" ? "32px" : "49px",
                height: type === "quoteAsset" ? "24px" : "24px",
              }}
            >
              <Typography
                sx={{
                  color:
                    children === "Active"
                      ? palette.success.light
                      : children === "Inactive"
                        ? palette.error.main
                        : null,
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  pb: "2px",
                }}
              >
                &nbsp;
                {children}
              </Typography>
            </Box>
          </Box>
        </Box>
      ) : null}

      {coinLoading && !coinError ? (
        <Box
          sx={{
            display: "flex",
            alignItems: wrapped ? "center" : "baseline",
            p: "9px 13px",
            color:
              mode === "light" ? palette.text.primary : palette.common.white,
            // border: "1px solid black",
            ...sx,
          }}
        >
          <Typography>
            {type === "quoteAsset" ? "Quote Asset:" : null}
            {type === "status" ? "Status:" : null}
          </Typography>
          <Box sx={{ height: "100%", display: "flex", flexDirection: "row" }}>
            <InfoIconTooltip type={type} />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ml: "6px",
                boxSizing: "border-box",
                width: type === "quoteAsset" ? "32px" : "49px",
                height: type === "quoteAsset" ? "24px" : "24px",
              }}
            >
              <LoadingSkeleton />
            </Box>
          </Box>
        </Box>
      ) : null}
    </>
  );
}
