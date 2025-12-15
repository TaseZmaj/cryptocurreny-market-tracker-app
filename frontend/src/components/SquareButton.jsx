import { IconButton, Tooltip, useColorScheme, useTheme } from "@mui/material";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";

function SquareButton({ type, onClick, sx = {} }) {
  const { palette } = useTheme();
  const { mode } = useColorScheme();

  const TOOLTIP_TITLES = {
    exportToCsvOhlcv: "Export all OHCLV data to .csv",
    exportToCsv24h: "Export the 24h data for all coins to .csv",
  };

  return (
    <Tooltip placement="bottom" title={TOOLTIP_TITLES[type]}>
      <IconButton
        onClick={() => onClick()}
        size="small"
        sx={{
          border: `1px solid ${
            mode === "light" ? palette.grey[700] : palette.grey[700]
          }`,
          borderRadius: "4px",
          width: "32px",
          height: "32px",
          ...sx,
        }}
      >
        <DownloadRoundedIcon
          sx={{
            color:
              mode === "light" ? palette.text.primary : palette.common.white,
          }}
        />
      </IconButton>
    </Tooltip>
  );
}

export default SquareButton;
