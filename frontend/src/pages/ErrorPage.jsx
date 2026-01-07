import {
  Box,
  Button,
  Typography,
  useColorScheme,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router";

function ErrorPage() {
  const { mode } = useColorScheme();
  const { palette } = useTheme();
  const navigate = useNavigate();

  //TODO: Refactor this code so that it uses the <MessageBox> component

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <Box sx={{ textAlign: "center", width: "600px" }}>
        <Typography
          variant="h1"
          fontSize="5.5rem"
          fontWeight="bold"
          sx={{
            color: mode === "light" ? palette.text.primary : palette.grey[100],
          }}
        >
          Oops!
        </Typography>
        <Typography
          variant="h4"
          // fontSize="2.5rem"
          fontWeight="bold"
          sx={{ color: palette.error.main, mb: "24px" }}
        >
          404 Not Found
        </Typography>
        <Typography
          sx={{
            color:
              mode === "light" ? palette.text.secondary : palette.grey[400],
          }}
        >
          The page you’re trying to access was either <b>moved</b> or{" "}
          <b>doesn’t exist</b>. Please make sure you have the correct url
          address and try again or feel free to go back to the Coins page.
        </Typography>
        <Button
          disableElevation
          variant="contained"
          sx={{ color: palette.common.white, mt: "14px" }}
          onClick={() => navigate("/coins")}
        >
          Back to Homepage
        </Button>
      </Box>
    </Box>
  );
}

export default ErrorPage;
