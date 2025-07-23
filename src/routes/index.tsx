import { createFileRoute } from "@tanstack/react-router";
// import { useGameMode } from "../store/useGameMode";
import { Box, Button, Stack } from "@mui/material";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
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
        <img
          src="../src/assets/images/LogoL.svg"
          alt="L - Logo"
          style={{ height: "60vh" }}
        />
        <Stack direction="column" spacing={4}>
          <Button variant="outlined" href="/new-game">
            NEW GAME
          </Button>
          <Button variant="outlined" href="/story">
            STORY
          </Button>
          <Button variant="outlined" href="/hints">
            HINTS
          </Button>
          <Button variant="outlined" href="/about">
            ABOUT
          </Button>
          <Button variant="outlined" href="/load-game">
            LOAD GAME
          </Button>
        </Stack>
      </Box>
    </>
  );
}

/*
 
     

        const gameMode = useGameMode((state) => state.gameMode);
  const toggleGameMode = useGameMode((state) => state.toggleGameMode);
      <div>Game mode: {gameMode}</div>
      <button
        onClick={() => toggleGameMode()}
        className="bg-blue-500 text-white px-2 py-1 rounded"
      >
        Change mode
      </button>
     
      */
