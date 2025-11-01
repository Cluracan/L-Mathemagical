import { Box, Card, TextField, useTheme } from "@mui/material";
import { memo, useEffect, useRef, useState, type ChangeEvent } from "react";
import { useGameStore } from "../../store/useGameStore";
import { Canvas } from "./Canvas";
import { useGameController } from "../../middleware/useGameController";
import { PuzzleDialog } from "./PuzzleDialog";
import { getSpectacleEncryption } from "../../utils/getSpectacleEncryption";

export const GameContent = memo(() => {
  const storyLine = useGameStore((state) => {
    // console.log(`call storyLine length ${state.storyLine.length}`);
    return state.storyLine;
  });
  const modernMode = useGameStore((state) => state.modernMode);
  const showDialog = useGameStore((state) => state.showDialog);
  const currentPuzzle = useGameStore((state) => state.currentPuzzle);
  const encryptionActive = useGameStore((state) => state.encryptionActive);
  const [trueInput, setTrueInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const { submitInput, reportAnimationComplete } = useGameController();

  //TODO - refactor/remove this! (styled component or just extract storyline)
  const theme = useTheme();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [storyLine]);

  const handleSubmit = (): void => {
    submitInput(trueInput);
    setTrueInput("");
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    //should be able to do this by taking currentInput and comparing to userInput - if deleted a section then return currentInput...if pasted a section then you would be in trouble, so maybe no ctrl v? or jsut handle 1 letter at a time to stop paste, but maybe only in encryption mode
    const currentInput = e.target.value;
    if (!encryptionActive) {
      setTrueInput(currentInput);
    } else {
      if (currentInput.length > trueInput.length) {
        const lastKeyEntered = currentInput[currentInput.length - 1];
        const updatedTrueInput = trueInput + lastKeyEntered;
        setTrueInput(updatedTrueInput);
      } else if (currentInput.length < trueInput.length) {
        const updatedTrueInput = trueInput.slice(0, currentInput.length);
        setTrueInput(updatedTrueInput);
      }
    }
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
                  color: theme.feedback[entry.type],
                }}
              >
                {entry.isEncrypted
                  ? getSpectacleEncryption(entry.text)
                  : entry.text}
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
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
          value={
            encryptionActive ? getSpectacleEncryption(trueInput) : trueInput
          }
        ></TextField>
      </Box>
      {currentPuzzle && (
        <PuzzleDialog puzzleId={currentPuzzle} showDialog={showDialog} />
      )}
    </>
  );
});

GameContent.displayName = "GameContent";
