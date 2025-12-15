import { Button, Typography, useColorScheme, useTheme } from "@mui/material";

function ChartDateControlButton({
  datePicker,
  setDatePicker,
  children,
  sx = {},
}) {
  const { mode } = useColorScheme();
  const { palette } = useTheme();

  const isSelected = datePicker === children;

  return (
    <Button
      disableRipple
      onClick={() => setDatePicker(children)}
      sx={{
        width: "74px",
        height: "32px",
        borderRadius: "4px",
        m: "0 8px",
        border: `1px solid ${
          isSelected ? palette.primary.dark : palette.grey[400]
        }`,
        backgroundColor: isSelected
          ? palette.primary.main
          : palette.background.paper,
        color: isSelected
          ? palette.common.white
          : mode === "light"
          ? palette.text.primary
          : palette.grey[200],
        ...sx,
      }}
    >
      <Typography variant="h6">{children}</Typography>
    </Button>
  );
}

export default ChartDateControlButton;
