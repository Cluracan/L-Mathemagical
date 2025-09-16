import { Box, Button, Stack, useTheme } from "@mui/material";
import { useGameStore } from "../../../store/useGameStore";
import { produce } from "immer";
import { createKeyGuard } from "../../../utils/guards";

import { PuzzleContainer } from "../../../components/puzzles/PuzzleContainer";
import { PuzzleHeader } from "../../../components/puzzles/PuzzleHeader";
import { PuzzleActions } from "../../../components/puzzles/PuzzleActions";
import { PuzzleFeedback } from "../../../components/puzzles/PuzzleFeedback";

//Types
export type LightsState = {
  curOrder: string[];
  feedback: string[];
  turns: number;
  switchesActive: boolean;
};
//Constants
const INITAL_ORDER = ["Yellow", "Red", "Green", "Blue"];
const TARGET_ORDER = ["Blue", "Green", "Red", "Yellow"];

//Static Data
const lightsFeedback = {
  initial: [
    "Right. You see the lights as they are but they should be like this:",
    "           BLUE, GREEN, RED, YELLOW",
    "That's in alphabetical order. We have to use switches 1,2,3 and 4 to do this.",
    "Try pressing the switches below...",
    " ",
  ],
  optimised: [
    "The electrician thanks you for your help. She wishes you luck and warns you to be careful.",
    `"These Drogos aren't to be trusted"`,
    'Your attention is caught by a roughly-carved wooden oar which is propped up in one corner of the room. The electrician notices your interest and says, "You can have that if you want it."',
  ],
  subOptimal: [
    `"You've done it," says the electrician, "but my apprentice, who is on holiday, reckons she can do it in four moves!"`,
    "Will you try again? (RESET or LEAVE)",
  ],
  reset: [`"OK, let's start again." says the electrician.`],
  leaveWithSuccess: [
    "The electrician thanks you for your help, and turns back to the sound system.",
  ],
  leaveWithFailure: [
    'The electrician looks hopefully at you - "Will you have another go?"',
  ],
};

//Initial State
export const initialLightsState = {
  curOrder: INITAL_ORDER,
  feedback: lightsFeedback.initial,
  turns: 0,
  switchesActive: true,
};

const applySwitch: Record<1 | 2 | 3 | 4, (colors: string[]) => string[]> = {
  1: (curColors) => [curColors[1], curColors[0], curColors[2], curColors[3]],
  2: (curColors) => [curColors[0], curColors[2], curColors[3], curColors[1]],
  3: (curColors) => curColors,
  4: (curColors) => [curColors[0], curColors[1], curColors[3], curColors[2]],
};

//Helper Functions
const isSwitchIndex = createKeyGuard(applySwitch);

const isCorrectOrder = (curOrder: string[]) =>
  TARGET_ORDER.every((color, index) => curOrder[index] === color);

function lightsReducer(
  state: LightsState,
  action: { type: "input"; button: number } | { type: "reset" }
) {
  let { curOrder, turns, switchesActive } = state;
  let nextFeedback = [...state.feedback];
  switch (action.type) {
    case "input":
      if (isSwitchIndex(action.button)) {
        turns++;
        nextFeedback.push(
          `You press switch ${action.button}`,
          `"That's ${turns} ${turns > 1 ? 'turns"' : 'turn"'}`
        );
        const nextOrder = applySwitch[action.button](curOrder);
        let puzzleCompleted = false;
        if (isCorrectOrder(nextOrder)) {
          if (turns === 4) {
            puzzleCompleted = true;
            switchesActive = false;
            nextFeedback.push(...lightsFeedback.optimised);
          } else {
            switchesActive = false;
            nextFeedback.push(...lightsFeedback.subOptimal);
          }
        }
        return {
          nextState: {
            ...state,
            curOrder: nextOrder,
            feedback: nextFeedback,
            turns,
            switchesActive,
          },
          puzzleCompleted,
        };
      }
      break;
    case "reset":
      return {
        nextState: {
          ...initialLightsState,
          feedback: [...nextFeedback, ...lightsFeedback.reset],
        },
        puzzleCompleted: false,
      };
  }
  return { nextState: state, puzzleCompleted: false };
}

export const LightsPuzzle = () => {
  const { curOrder, turns, feedback, switchesActive } = useGameStore(
    (state) => state.puzzleState.lights
  );
  const theme = useTheme();
  const puzzleCompleted = useGameStore((state) => state.puzzleCompleted.lights);

  const handleClick = (switchIndex: number) => {
    useGameStore.setState((state) =>
      produce(state, (draft) => {
        const { nextState, puzzleCompleted } = lightsReducer(
          draft.puzzleState.lights,
          { type: "input", button: switchIndex }
        );
        draft.puzzleState.lights = nextState;
        if (puzzleCompleted) {
          draft.puzzleCompleted.lights = true;
        }
      })
    );
  };

  const handleReset = () => {
    useGameStore.setState((state) =>
      produce(state, (draft) => {
        const { nextState } = lightsReducer(draft.puzzleState.lights, {
          type: "reset",
        });
        draft.puzzleState.lights = nextState;
      })
    );
  };

  const handleLeave = () => {
    useGameStore.setState((state) =>
      produce(state, (draft) => {
        draft.showDialog = false;
        draft.currentPuzzle = null;
        if (isCorrectOrder(curOrder) && turns === 4) {
          draft.itemLocation.oar = "lights";
          draft.puzzleCompleted.lights = true;
          draft.storyLine.push(...lightsFeedback.leaveWithSuccess);
        } else {
          draft.puzzleState.lights.feedback = lightsFeedback.initial;
          draft.puzzleState.lights.curOrder = INITAL_ORDER;
          draft.puzzleState.lights.turns = 0;
          draft.puzzleState.lights.switchesActive = true;
          draft.storyLine.push(...lightsFeedback.leaveWithFailure);
        }
      })
    );
  };

  return (
    <>
      <PuzzleContainer>
        <PuzzleHeader
          title="Lights Puzzle"
          description="Put the lights into alphabetical order"
        />
        <Stack
          direction={"row"}
          width={"80%"}
          p={4}
          m={2}
          sx={{
            justifyContent: "space-around",
          }}
        >
          {curOrder.map((color) => (
            <div
              key={color}
              style={{
                color: "black",
                backgroundColor: color,
                borderRadius: "100%",
                height: theme.spacing(12),
                width: theme.spacing(12),
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {color}
            </div>
          ))}
        </Stack>
        <PuzzleFeedback feedback={feedback} height="30vh" />

        <PuzzleActions
          puzzleCompleted={puzzleCompleted}
          handleReset={handleReset}
          handleLeave={handleLeave}
        >
          <Box>
            {[1, 2, 3, 4].map((value) => (
              <Button
                variant="contained"
                size="large"
                key={value}
                sx={{ m: 2 }}
                onClick={() => handleClick(value)}
                disabled={!switchesActive}
              >
                {value}
              </Button>
            ))}
          </Box>
        </PuzzleActions>
      </PuzzleContainer>
    </>
  );
};
