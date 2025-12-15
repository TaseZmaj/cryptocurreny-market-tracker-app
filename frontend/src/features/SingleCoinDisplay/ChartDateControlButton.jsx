import { Button, Typography, useColorScheme, useTheme } from "@mui/material";
import { darkBackgroundColor } from "../../util/uiVars";

function ChartDateControlButton({
  datePicker,
  setDatePicker,
  children,
  sx = {},
}) {
  const { palette } = useTheme();
  const { mode } = useColorScheme();

  const isSelected = datePicker === children;

  return (
    <Button
      disableRipple
      onClick={() => setDatePicker(children)}
      sx={{
        // transition: "none",
        width: "74px",
        height: "32px",
        borderRadius: "4px",
        m: "0 8px",
        border: `1px solid ${
          isSelected
            ? mode === "light"
              ? palette.primary.dark
              : palette.grey[200]
            : palette.grey[700]
        }`,
        backgroundColor: isSelected
          ? palette.primary.main
          : mode === "light"
          ? palette.background.paper
          : darkBackgroundColor,
        color: isSelected
          ? palette.common.white
          : mode === "light"
          ? palette.text.primary
          : palette.common.white,
        ...sx,
      }}
    >
      <Typography variant="h6">{children}</Typography>
    </Button>
  );
}

export default ChartDateControlButton;
