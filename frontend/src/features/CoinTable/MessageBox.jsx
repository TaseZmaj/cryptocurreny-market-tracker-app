import { Box, Button, Typography, useTheme } from "@mui/material";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

function MessageBox({
  type = null,
  title,
  children,
  buttonType = null,
  onClickFunc = null,
  sx,
}) {
  const { palette } = useTheme();

  return (
    <Box sx={{ textAlign: "center", ...sx }}>
      <Typography variant="h1" sx={{ fontSize: "5.5rem" }} fontWeight="bold">
        {title}
      </Typography>
      <Typography variant="body1">{children}</Typography>
      <Typography variant="body1">
        {type === "error" ? "Please try again in a short while!" : null}
      </Typography>
      <Button
        variant="contained"
        sx={{ color: palette.common.white, mt: "10px" }}
        startIcon={buttonType === "refresh" ? <RefreshRoundedIcon /> : null}
        onClick={onClickFunc}
      >
        {buttonType === "refresh" ? "REFRESH" : null}
        {buttonType === "homepage" ? "Back to homepage" : null}
      </Button>
    </Box>
  );
}

export default MessageBox;
