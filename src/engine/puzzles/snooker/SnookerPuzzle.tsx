import { Button, InputAdornment, TextField } from "@mui/material";
import { PuzzleActions } from "../../../components/puzzles/PuzzleActions";
import { PuzzleContainer } from "../../../components/puzzles/PuzzleContainer";
import { PuzzleFeedback } from "../../../components/puzzles/PuzzleFeedback";
import { PuzzleHeader } from "../../../components/puzzles/PuzzleHeader";
import { useGameStore } from "../../../store/useGameStore";
import { useRef, useState, type ChangeEvent } from "react";

import { produce } from "immer";
import { initialSnookerState, snookerFeedback } from "./snookerConstants";
import { SnookerCanvas } from "./SnookerCanvas";

// Constants
const MAX_ANGLE = 999;

export const SnookerPuzzle = () => {
  // State
  const feedback = useGameStore((state) => state.puzzleState.snooker.feedback);
  const action = useGameStore((state) => state.puzzleState.snooker.action);
  const puzzleCompleted = useGameStore(
    (state) => state.puzzleState.snooker.puzzleCompleted
  );
  const [angleInput, setAngleInput] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handlers
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (isNaN(Number(e.target.value)) || Number(e.target.value) > MAX_ANGLE)
      return;
    setAngleInput(Number(e.target.value));
  };

  const handleHit = () => {
    if (action === "idle") return;
    useGameStore.setState((state) =>
      produce(state, (draft) => {
        draft.puzzleState.snooker.angle = angleInput;
        draft.puzzleState.snooker.action = "hit";
      })
    );
  };

  const onAnimationComplete = () => {
    useGameStore.setState((state) =>
      produce(state, (draft) => {
        draft.puzzleState.snooker.feedback = snookerFeedback.success;
        draft.puzzleState.snooker.action = "idle";
      })
    );
  };

  const handleReset = () => {
    setAngleInput(0);
    useGameStore.setState((state) =>
      produce(state, (draft) => {
        draft.puzzleState.snooker = {
          ...initialSnookerState,
          action: "reset",
        };
      })
    );
    inputRef.current?.focus();
  };

  const handleLeave = () => {
    useGameStore.setState((state) =>
      produce(state, (draft) => {
        draft.showDialog = false;
        draft.currentPuzzle = null;
        draft.puzzleState.snooker = initialSnookerState;
        draft.storyLine.push({
          type: "description",
          text: snookerFeedback.storyLine,
          isEncrypted: draft.encryptionActive,
        });
      })
    );
  };

  // Render
  return (
    <>
      <PuzzleContainer>
        <PuzzleHeader title="Snooker Puzzle" description="Hit the ball!" />
        <SnookerCanvas onAnimationComplete={onAnimationComplete} />
        <PuzzleFeedback feedback={[feedback]} height="4rem" />
        <PuzzleActions
          handleLeave={handleLeave}
          handleReset={handleReset}
          puzzleCompleted={puzzleCompleted}
        >
          <TextField
            label="Angle"
            autoFocus
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleHit();
              }
            }}
            value={angleInput}
            inputRef={inputRef}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">&deg;</InputAdornment>
                ),
              },
              htmlInput: {
                style: { textAlign: "right", width: "4ch" },
                inputMode: "numeric",
              },
            }}
          />
          <Button disabled={action !== "reset"} onClick={handleHit}>
            Hit
          </Button>
        </PuzzleActions>
      </PuzzleContainer>
    </>
  );
};
