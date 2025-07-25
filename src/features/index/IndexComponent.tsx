import { Box, Button, Stack } from "@mui/material";
import logoL from "./images/LogoL.svg";
import { Link } from "@tanstack/react-router";

export const IndexContent = () => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          height: "100vh",
          width: "60vw",
        }}
      >
        <img src={logoL} alt="L - Logo" style={{ height: "72vh" }} />
        <Stack direction="column" spacing={4}>
          <Button variant="outlined" component={Link} to="/new-game">
            NEW GAME
          </Button>
          <Button variant="outlined" component={Link} to="/story">
            STORY
          </Button>
          <Button variant="outlined" component={Link} to="/hints">
            HINTS
          </Button>
          <Button variant="outlined" component={Link} to="/about">
            ABOUT
          </Button>
          <Button variant="outlined" component={Link} to="/load-game">
            LOAD GAME
          </Button>
        </Stack>
      </Box>
    </>
  );
};
