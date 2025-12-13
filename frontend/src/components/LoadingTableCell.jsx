import { Skeleton, useColorScheme, useTheme } from "@mui/material";

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
