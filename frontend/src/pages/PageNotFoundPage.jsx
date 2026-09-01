import {
  Box,
  Button,
  Typography,
  useColorScheme,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router";
import logo from "../assets/logo_v2.png";
import CloudOffIcon from "@mui/icons-material/CloudOff";

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
      <Box
        component="img"
        src={logo}
        alt=""
        aria-hidden="true"
        sx={{
          position: "absolute",
          // top: 115,
          width: {
            xs: "min(88vw, 360px)",
            sm: "min(70vw, 520px)",
            lg: "620px",
          },
          height: "auto",
          opacity: mode === "light" ? 0.075 : 0.045,
          pointerEvents: "none",
          userSelect: "none",
        }}
      />
      <Box sx={{ textAlign: "center", width: "600px" }}>
        <Typography
          variant="h2"
          fontWeight="bold"
          sx={{
            fontSize: { xs: "5rem", md: "4.7rem", lg: "4.9rem" },
            color: mode === "light" ? palette.text.primary : palette.grey[100],
          }}
        >
          Oops!
        </Typography>
        <Typography
          fontWeight="bold"
          sx={{
            fontSize: { xs: "1.4rem", md: "2rem", lg: "2.5rem" },
            color: palette.error.light,
            mb: "17px",
          }}
        >
          404 Not Found
        </Typography>
        <Typography
          sx={{
            color:
              mode === "light" ? palette.text.secondary : palette.grey[400],
          }}
        >
          The page you're trying to access was either <b>moved</b> or{" "}
          <b>doesn't exist</b>.
        </Typography>
        <Typography
          sx={{
            mt: 1,
            color:
              mode === "light" ? palette.text.secondary : palette.grey[400],
          }}
        >
          Please make sure you have the correct url and try again, or feel free
          to go back to the coins page.
        </Typography>
        <Button
          variant="contained"
          sx={{
            // border: `1px solid primary.${palette.primary.main}`,
            position: "relative",
            mt: 7,
            pt: 1.3,
            pb: 1.3,
            "&:hover": {},
          }}
          onClick={() => navigate("/coins")}
          disableElevation
          disableRipple
          disableFocusRipple
        >
          <Typography
            sx={{
              fontSize: "1.2rem",
              fontWeight: 500,
              color: "#fcfbfbf3",
            }}
          >
            Back to Homepage
          </Typography>
        </Button>
      </Box>
    </Box>
  );
}

export default ErrorPage;
