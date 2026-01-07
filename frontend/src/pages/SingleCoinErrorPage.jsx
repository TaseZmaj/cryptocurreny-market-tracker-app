import {
  Box,
  Button,
  Typography,
  useColorScheme,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router";

//TODO: Refactor this code so that it uses the <MessageBox> component

function SingleCoinErrorPage({ coin }) {
  const { mode } = useColorScheme();
  const { palette } = useTheme();
  const navigate = useNavigate();

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
          Unknown coin!
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
          {`Financial data for ${coin.coinId} doesn’t exist! 
            However, there is data for many other interesting coins
            on our homepage.`}
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

export default SingleCoinErrorPage;
