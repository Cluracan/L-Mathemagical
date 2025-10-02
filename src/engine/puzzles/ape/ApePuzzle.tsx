import { produce } from "immer";
import { PuzzleActions } from "../../../components/puzzles/PuzzleActions";
import { PuzzleContainer } from "../../../components/puzzles/PuzzleContainer";
import { PuzzleHeader } from "../../../components/puzzles/PuzzleHeader";
import { useGameStore } from "../../../store/useGameStore";
import { PuzzleFeedback } from "../../../components/puzzles/PuzzleFeedback";
import { Button, Stack, TextField } from "@mui/material";
import { apeFeedback, initialApeState } from "./apeConstants";
import { useState, type ChangeEvent, type KeyboardEventHandler } from "react";
import { apeReducer } from "./apeReducer";

export const ApePuzzle = () => {
  const puzzleCompleted = useGameStore(
    (state) => state.puzzleState.ape.puzzleCompleted
  );
  const feedback = useGameStore((state) => state.puzzleState.ape.feedback);
  const status = useGameStore((state) => state.puzzleState.ape.status);
  const word = useGameStore((state) => state.puzzleState.ape.word);
  const [userInput, setUserInput] = useState("");

  const handleLeave = () => {
    useGameStore.setState((state) =>
      produce(state, (draft) => {
        draft.showDialog = false;
        draft.currentPuzzle = null;
        if (draft.puzzleState.ape.puzzleCompleted) {
          draft.storyLine.push(apeFeedback.storyLineSuccess);
          draft.itemLocation.ladder = "store";
        } else {
          draft.puzzleState.ape = initialApeState;
          draft.storyLine.push(apeFeedback.storyLineFailure);
        }
      })
    );
  };
  const handleReset = () => {
    useGameStore.setState((state) =>
      produce(state, (draft) => {
        draft.puzzleState.ape = apeReducer(draft.puzzleState.ape, {
          type: "reset",
        });
      })
    );
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      useGameStore.setState((state) =>
        produce(state, (draft) => {
          draft.puzzleState.ape = apeReducer(draft.puzzleState.ape, {
            type: "input",
            userInput,
          });
        })
      );
      setUserInput("");
    }
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  return (
    <PuzzleContainer>
      <PuzzleHeader
        title="Ape Puzzle"
        description="Turn the ape into an owl."
      />
      <PuzzleFeedback feedback={feedback.slice(-20)} height="50vh" />
      {status === "instructions" && (
        <>
          <Stack
            direction={"row"}
            sx={{ m: 2, width: "60%", justifyContent: "space-around" }}
          >
            <Button
              size="large"
              onClick={() =>
                useGameStore.setState((state) =>
                  produce(state, (draft) => {
                    draft.puzzleState.ape = apeReducer(draft.puzzleState.ape, {
                      type: "showDemo",
                    });
                  })
                )
              }
            >
              Yes please!
            </Button>
            <Button size="large" onClick={handleLeave}>
              No thanks!
            </Button>
          </Stack>
        </>
      )}
      {status === "play" && (
        <PuzzleActions
          puzzleCompleted={puzzleCompleted}
          handleReset={handleReset}
          handleLeave={handleLeave}
        >
          <TextField
            autoFocus
            label={word}
            onKeyDown={handleKeyDown}
            onChange={handleChange}
            value={userInput}
          ></TextField>
        </PuzzleActions>
      )}
    </PuzzleContainer>
  );
};
