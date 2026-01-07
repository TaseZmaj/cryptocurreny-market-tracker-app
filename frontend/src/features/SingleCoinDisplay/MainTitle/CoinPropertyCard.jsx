import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  useColorScheme,
  useTheme,
} from "@mui/material";
import InfoIconTooltip from "../InfoIconTooltip";

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

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: wrapped ? "center" : "baseline",
        p: "9px 13px",
        color: mode === "light" ? palette.text.primary : palette.common.white,
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
        <Typography
          sx={{
            color:
              children === "Active"
                ? palette.success.light
                : children === "Inactive"
                ? palette.error.main
                : null,
            fontWeight: "bold",
          }}
        >
          &nbsp;
          {children}
        </Typography>
      </Box>
    </Box>
  );
}
