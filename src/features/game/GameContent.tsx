import {
  Box,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  TextField,
  Tooltip,
  useTheme,
} from "@mui/material";
import { memo, useEffect, useRef, useState, type ChangeEvent } from "react";
import { useGameStore, type StoryLineEntry } from "../../store/useGameStore";
import { Canvas } from "./Canvas";
import { useGameController } from "../../middleware/useGameController";
import { PuzzleDialog } from "./PuzzleDialog";
import { getSpectacleEncryption } from "../../utils/getSpectacleEncryption";
import { Save } from "@mui/icons-material";
import { saveGame } from "../../utils/saveGame";
import { useInputHistory } from "../hooks/useInputHistory";

// Types
interface UserInputArgs {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onSave: () => void;
  onGetPrevious: () => void;
  onGetNext: () => void;
  trueInput: string;
}

interface GameLogProps {
  entries: StoryLineEntry[];
}

export const GameContent = memo(() => {
  // State
  const storyLine = useGameStore((state) => state.storyLine);
  const modernMode = useGameStore((state) => state.modernMode);
  const showDialog = useGameStore((state) => state.showDialog);
  const currentPuzzle = useGameStore((state) => state.currentPuzzle);
  const encryptionActive = useGameStore((state) => state.encryptionActive);
  const { addToHistory, getPreviousInput, getNextInput } = useInputHistory();
  const [trueInput, setTrueInput] = useState("");

  const { submitInput, reportAnimationComplete } = useGameController();

  // Handlers
  const handleSubmit = (): void => {
    submitInput(trueInput);
    addToHistory(trueInput);
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

  const handleGetPrevious = (): void => {
    const previousInput = getPreviousInput();
    setTrueInput(previousInput);
  };

  const handleGetNext = (): void => {
    const nextInput = getNextInput();
    setTrueInput(nextInput);
  };

  // Render
  return (
    <>
      {modernMode && (
        <Canvas reportAnimationComplete={reportAnimationComplete} />
      )}

      <Box height={"80vh"} width={"60vw"} sx={{ marginLeft: "2rem" }}>
        <GameLog entries={storyLine.slice(-30)} />
        <UserInput
          onChange={handleChange}
          onSubmit={handleSubmit}
          onSave={saveGame}
          onGetPrevious={handleGetPrevious}
          onGetNext={handleGetNext}
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

const UserInput = (args: UserInputArgs) => {
  // State
  const { onChange, onSubmit, onSave, onGetPrevious, onGetNext, trueInput } =
    args;
  const encryptionActive = useGameStore((state) => state.encryptionActive);
  const visibleInput = encryptionActive
    ? getSpectacleEncryption(trueInput)
    : trueInput;

  return (
    <TextField
      fullWidth
      autoFocus
      aria-label="Type your command"
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip title="Save game">
                <IconButton aria-label="save" onClick={onSave}>
                  <Save />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ),
        },
      }}
      onChange={onChange}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onSubmit();
        } else if (e.key === "ArrowUp") {
          onGetPrevious();
        } else if (e.key === "ArrowDown") {
          onGetNext();
        }
      }}
      value={visibleInput}
    ></TextField>
  );
};

const GameLog = ({ entries }: GameLogProps) => {
  // State
  const theme = useTheme();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Effects
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [entries]);

  // Render
  return (
    <List
      sx={{
        height: 1,
        padding: "1rem",
        overflowY: "auto",
        whiteSpace: "pre-wrap",
      }}
      aria-label="Game feedback"
      role="log"
    >
      {entries.map((entry, index) => {
        return (
          <ListItem
            key={index}
            sx={{
              marginBottom: "1.5rem",
              color: theme.feedback[entry.type],
            }}
          >
            {entry.isEncrypted
              ? getSpectacleEncryption(entry.text)
              : entry.text}
          </ListItem>
        );
      })}
      <div ref={bottomRef} />
    </List>
  );
};
