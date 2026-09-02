import { Box, Button, Typography, useTheme } from "@mui/material";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

//This component is used for the the messages in the error pages
function MessageBox({
  type = null,
  title,
  children,
  buttonType = null,
  onClickFunc = null,
  sx,
}) {
  const { palette } = useTheme();
  const { mode } = useTheme();

  return (
    <Box sx={{ textAlign: "center", ...sx }}>
      <Typography variant="h1" sx={{ fontSize: "5.5rem" }} fontWeight="bold">
        {title}
      </Typography>
      <Typography
        variant="body1"
        sx={{ color: mode === "light" ? palette.grey[600] : palette.grey[400] }}
      >
        {children}
      </Typography>
      <Typography
        variant="body1"
        sx={{ color: mode === "light" ? palette.grey[600] : palette.grey[400] }}
      >
        {type === "error" ? "Please try again in a short while!" : null}
      </Typography>
      <Button
        variant="contained"
        sx={{
          // border: `1px solid primary.${palette.primary.main}`,
          position: "relative",
          mt: 5,
          pt: 1.3,
          pb: 1.3,
          color: palette.common.white,
        }}
        startIcon={buttonType === "refresh" ? <RefreshRoundedIcon /> : null}
        onClick={onClickFunc}
        disableElevation
        disableRipple
        disableFocusRipple
      >
        <Typography
          sx={{
            fontSize: "1.3rem",
            fontWeight: 500,
            color: "#fcfbfbf3",
          }}
        >
          {buttonType === "refresh" ? "REFRESH" : null}
          {buttonType === "homepage" ? "Back to homepage" : null}
        </Typography>
      </Button>
    </Box>
  );
}

export default MessageBox;
