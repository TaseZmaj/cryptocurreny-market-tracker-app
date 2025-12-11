import { blue, common } from "@mui/material/colors";
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  experimental_extendTheme as extendTheme,
} from "@mui/material/styles";

export default function AppTheme({ children }) {
  const customTheme = extendTheme({
    colorSchemes: {
      light: {
        palette: {
          primary: {
            main: blue[400],
          },
        },
      },
      dark: {
        palette: {
          primary: {
            main: blue[400],
          },
          background: {
            default: common.black,
          },
        },
      },
    },

    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
  });

  return <CssVarsProvider theme={customTheme}>{children}</CssVarsProvider>;
}
