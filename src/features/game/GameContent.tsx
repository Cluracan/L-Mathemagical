import {
  Box,
  Card,
  IconButton,
  InputAdornment,
  TextField,
  useTheme,
} from "@mui/material";
import { memo, useEffect, useRef, useState, type ChangeEvent } from "react";
import { useGameStore } from "../../store/useGameStore";
import { Canvas } from "./Canvas";
import { useGameController } from "../../middleware/useGameController";
import { PuzzleDialog } from "./PuzzleDialog";
import { getSpectacleEncryption } from "../../utils/getSpectacleEncryption";
import { DarkMode, LightMode, Save } from "@mui/icons-material";
import { saveGame } from "../../utils/saveGame";

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

        <UserInput
          onChange={handleChange}
          onSubmit={handleSubmit}
          onSave={saveGame}
          trueInput={trueInput}
        />
      </Box>
      {currentPuzzle && (
        <PuzzleDialog puzzleId={currentPuzzle} showDialog={showDialog} />
      )}
    </>
  );
});

GameContent.displayName = "GameContent";

interface UserInputArgs {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onSave: () => void;
  trueInput: string;
}
const UserInput = (args: UserInputArgs) => {
  const { onChange, onSubmit, onSave, trueInput } = args;
  const encryptionActive = useGameStore((state) => state.encryptionActive);
  return (
    <TextField
      fullWidth
      autoFocus
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton>
                <DarkMode />
                <LightMode />
              </IconButton>
              <IconButton onClick={onSave}>
                <Save />
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
      onChange={onChange}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onSubmit();
        }
      }}
      value={encryptionActive ? getSpectacleEncryption(trueInput) : trueInput}
    ></TextField>
  );
};
