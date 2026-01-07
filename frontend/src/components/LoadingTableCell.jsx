import { Skeleton, useColorScheme, useTheme } from "@mui/material";

//Is used for skeleton loading states throughot the entire app
function LoadingTableCell({ sx = {} }) {
  const { palette } = useTheme();
  const { mode } = useColorScheme();

  return (
    <Skeleton
      variant="rounded"
      animation="pulse"
      height="80%"
      sx={{
        width: "100%",
        bgcolor: mode === "light" ? palette.grey[300] : palette.grey[800],
        borderRadius: "10px",
        ...sx,
      }}
    />
  );
}

export default LoadingTableCell;
