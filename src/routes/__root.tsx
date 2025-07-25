import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@fontsource/mystery-quest/400.css";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "hsla(66, 70%, 54%, 1.00)",
      light: "hsla(66, 70%, 63%, 1.00)",
      dark: "hsla(66, 61%, 37%, 1.00)",
      contrastText: "#211e08",
    },

    // background: {
    //   default: "#14181b",
    // },
  },
});

export const Route = createRootRoute({
  component: () => (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
      }}
    >
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Outlet />
        <TanStackRouterDevtools />
      </ThemeProvider>
    </Box>
  ),
});
