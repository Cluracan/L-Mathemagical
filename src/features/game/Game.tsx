import { Box, Card, TextField } from "@mui/material";
import { useGameStore } from "../../store/useGameStore";
import { memo, useEffect, useRef, useState, type ChangeEvent } from "react";
import { Canvas } from "./Canvas";
import { useGameController } from "../../middleware/useGameController";

import { PuzzleDialog } from "./PuzzleDialog";

export const GameContent = memo(() => {
  const storyLine = useGameStore((state) => {
    // console.log(`call storyLine length ${state.storyLine.length}`);
    return state.storyLine;
  });
  const modernMode = useGameStore((state) => state.modernMode);
  const showDialog = useGameStore((state) => state.showDialog);
  const currentPuzzle = useGameStore((state) => state.currentPuzzle);
  const [userInput, setUserInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const { submitInput, reportAnimationComplete } = useGameController();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [storyLine]);

  const handleSubmit = (): void => {
    submitInput(userInput);
    setUserInput("");
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    //can now tranlate this when in spectacle mode
    setUserInput(e.target.value);
  };

  return (
    <>
      {modernMode && (
        <Canvas reportAnimationComplete={reportAnimationComplete} />
      )}

      <Box height={"80vh"} width={"60vw"} sx={{ marginLeft: "2rem" }}>
        <Card
          sx={{
            height: 1,
            padding: "1rem",
            overflowY: "auto",
            whiteSpace: "pre-wrap",
          }}
        >
          {storyLine.slice(-30).map((entry, index) => {
            return (
              <Box
                key={index}
                sx={{
                  marginBottom: "1.5rem",
                }}
              >
                {entry.text}
              </Box>
            );
          })}
          <div ref={bottomRef} />
        </Card>
        <TextField
          fullWidth
          autoFocus
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
          value={userInput}
        ></TextField>
      </Box>
      {currentPuzzle && (
        <PuzzleDialog puzzleId={currentPuzzle} showDialog={showDialog} />
      )}
    </>
  );
});

GameContent.displayName = "GameContent";
