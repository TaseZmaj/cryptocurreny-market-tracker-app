import { useColorScheme, useTheme } from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { InputAdornment, TextField } from "@mui/material";
import { useState } from "react";

export default function SearchInput({ query, setQuery, sx }) {
  const [focused, setFocused] = useState(false);
  const { palette } = useTheme();
  const { mode } = useColorScheme();

  return (
    <TextField
      sx={{
        width: "300px",
        transitionDuration: "150ms",
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor:
              mode === "light" ? palette.text.primary : palette.common.white, // border color
          },
          "&:hover fieldset": {
            borderColor: palette.primary.main,
          },
          "&.Mui-focused fieldset": {
            borderColor: palette.primary.main,
          },
          "& input": {
            color:
              mode === "light" ? palette.text.primary : palette.common.white, // input text color
          },
        },
        "& .MuiInputLabel-root": {
          color:
            mode === "light" ? palette.text.secondary : palette.common.white, // label color
        },
        "& .MuiInputLabel-root.Mui-focused": {
          color: palette.primary.main,
        },
        ...sx,
      }}
      variant="outlined"
      label="Search coins..."
      size="small"
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchOutlinedIcon
                sx={{
                  color: focused
                    ? palette.primary.main
                    : mode === "light"
                    ? palette.common.black
                    : palette.common.white,
                  transition: "all 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                }}
              />
            </InputAdornment>
          ),
        },
      }}
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    ></TextField>
  );
}
