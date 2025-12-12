import { Box, Button, Typography, useTheme } from "@mui/material";

function MessageBox({ type = null, title, children, buttonType = null, sx }) {
  const { palette } = useTheme();

  return (
    <Box sx={{ textAlign: "center", ...sx }}>
      <Typography variant="h2" fontWeight="bold">
        {title}
      </Typography>
      <Typography variant="body1">{children}</Typography>
      <Typography variant="body1">
        {type === "error" ? "Please try again in a short while!" : null}
      </Typography>

      {buttonType === "refresh" ? (
        <Button variant="contained" sx={{ color: palette.common.white }}>
          REFRESH
        </Button>
      ) : null}
      {buttonType === "homepage" ? (
        <Button variant="contained" sx={{ color: palette.common.white }}>
          Back to homepage
        </Button>
      ) : null}
    </Box>
  );
}

export default MessageBox;
