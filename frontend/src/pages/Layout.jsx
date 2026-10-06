import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Box } from "@mui/material";
import { useTheme, useColorScheme } from "@mui/material/styles";
import { useLocation } from "react-router";
import { motion } from "framer-motion";

function Layout() {
  const { mode } = useColorScheme();
  const { palette } = useTheme();
  const { pathname } = useLocation();

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        margin: 0,
        padding: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar title={pathname === "/" ? false : true} />

      <Box
        sx={{
          bgcolor:
            mode === "light" ? palette.common.white : palette.background.dark,
          flexGrow: 1,
          p: { xs: "10px", md: "20px" },
          overflowY: { xs: "auto", md: "hidden" },
          minHeight: 0,
        }}
      >
        <Box
          key={pathname}
          component={motion.div}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          sx={{
            width: "100%",
            height: "100%",
            minHeight: 0,
            flexGrow: 1,
          }}
        >
          <Outlet />
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}

export default Layout;
