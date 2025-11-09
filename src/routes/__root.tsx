import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import "@fontsource/orbitron/400.css";
import "@fontsource/mystery-quest/400.css";
import "@fontsource/dseg7/400.css";

declare module "@mui/material/styles" {
  interface Theme {
    feedback: {
      input: string;
      description: string;
      action: string;
      warning: string;
    };
  }
  // allow configuration using `createTheme()` https://mui.com/material-ui/customization/theming/
  interface ThemeOptions {
    feedback?: {
      input?: string;
      description?: string;
      action?: string;
      warning?: string;
    };
  }
}

const darkTheme = createTheme({
  typography: {
    fontSize: 18,
    fontFamily: "Lucida Console",
  },
  palette: {
    mode: "dark",
    primary: {
      main: "hsla(66, 70%, 54%, 1.00)",
      light: "hsla(66, 70%, 63%, 1.00)",
      dark: "hsla(66, 61%, 37%, 1.00)",
      contrastText: "#211e08",
    },
  },
  feedback: {
    input: "rgba(236, 255, 68, 1)",
    description: "white",
    action: "rgba(178, 250, 180, 1)",
    warning: "rgba(255, 112, 102, 1)",
  },
});

export const Route = createRootRoute({
  component: () => (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Outlet />
      </ThemeProvider>
    </Box>
  ),
});

//["Lucida Console", "DejaVu Sans Mono", "FreeMono", "Open Sans", "Arial", "Helvetica", "sans-serif"
