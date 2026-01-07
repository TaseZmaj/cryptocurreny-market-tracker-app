import { IconButton, Tooltip, useColorScheme, useTheme } from "@mui/material";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";

const TOOLTIP_TITLES = {
  exportToCsvOhlcv: "Export all OHCLV data to .csv",
  exportToCsv24h: "Export the 24h data for all coins to .csv",
};

//Currently used for the "Export to .csv buttons, but these is room for exansion if needed"

function SquareButton({ type, onClick, sx = {} }) {
  const { palette } = useTheme();
  const { mode } = useColorScheme();

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
        {type.includes("exportToCsv") ? (
          <DownloadRoundedIcon
            sx={{
              color:
                mode === "light" ? palette.text.primary : palette.common.white,
            }}
          />
        ) : null}
      </IconButton>
    </Tooltip>
  );
}

export default SquareButton;
