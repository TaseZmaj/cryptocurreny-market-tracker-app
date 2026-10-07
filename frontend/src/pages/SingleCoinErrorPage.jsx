import {
  Box,
  Button,
  Typography,
  useColorScheme,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router";
import logo from "../assets/logo_v2.png";
import { motion } from "framer-motion";

function SingleCoinErrorPage({
  coin,
  isInitializing = false,
  isUnavailable = false,
  onRetry,
}) {
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
      <Box
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: mode === "light" ? 0.075 : 0.045, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        component={motion.img}
        src={logo}
        alt=""
        aria-hidden="true"
        sx={{
          position: "absolute",
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
      <Box
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        component={motion.div}
        sx={{ textAlign: "center", width: { xs: "100%", sm: "600px" } }}
      >
        <Typography
          variant="h1"
          fontSize="5rem"
          fontWeight="bold"
          sx={{
            color: mode === "light" ? palette.text.primary : palette.grey[100],
          }}
        >
          {isInitializing
            ? "Getting things ready"
            : isUnavailable
              ? "Temporarily unavailable"
              : "Unknown coin!"}
        </Typography>
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{
            color: isInitializing ? palette.primary.light : palette.error.main,
            mb: "24px",
          }}
        >
          {isInitializing
            ? "The pipeline is working"
            : isUnavailable
              ? "Service unavailable"
              : "404 Not Found"}
        </Typography>
        <Typography
          sx={{
            color:
              mode === "light" ? palette.text.secondary : palette.grey[400],
          }}
        >
          {isInitializing
            ? "The project was just started and the data pipeline is populating the database. Please wait a little before trying again."
            : isUnavailable
              ? "We couldn't load this coin right now because the backend is unavailable. Please try again shortly."
              : `Financial data for ${coin.coinId} doesn’t exist! However, there is data for many other interesting coins on our homepage.`}
        </Typography>
        <Button
          disableElevation
          variant="contained"
          sx={{ color: palette.common.white, mt: "14px" }}
          onClick={() =>
            isInitializing || isUnavailable ? onRetry?.() : navigate("/coins")
          }
        >
          {isInitializing || isUnavailable ? "Try Again" : "Back to Homepage"}
        </Button>
      </Box>
    </Box>
  );
}

export default SingleCoinErrorPage;
