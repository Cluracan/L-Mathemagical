import { Box, Button, Card } from "@mui/material";
import { useGameStore } from "../../../store/useGameStore";
import { produce } from "immer";
import { createKeyGuard } from "../../../utils/guards";
import { useEffect, useRef } from "react";
import { PuzzleContainer } from "../../../components/puzzles/PuzzleContainer";
import { PuzzleHeader } from "../../../components/puzzles/PuzzleHeader";
import { PuzzleActions } from "../../../components/puzzles/PuzzleActions";

export const initialLightsOrder = ["Yellow", "Red", "Green", "Blue"];

export const initialLightsFeedback = [
  "Right. You see the lights as they are but they should be like this:",
  "           BLUE, GREEN, RED, YELLOW",
  "That's in alphabetical order. We have to use switches 1,2,3 and 4 to do this.",
  "Try pressing the switches below...",
  " ",
];

const targetOrder = ["Blue", "Green", "Red", "Yellow"];

const lightsFeedback = {
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

const applySwitch: Record<1 | 2 | 3 | 4, (colors: string[]) => string[]> = {
  1: (curColors) => [curColors[1], curColors[0], curColors[2], curColors[3]],
  2: (curColors) => [curColors[0], curColors[2], curColors[3], curColors[1]],
  3: (curColors) => curColors,
  4: (curColors) => [curColors[0], curColors[1], curColors[3], curColors[2]],
};

const isSwitchIndex = createKeyGuard(applySwitch);

const isCorrectOrder = (curOrder: string[]) =>
  targetOrder.every((color, index) => curOrder[index] === color);

export const LightsPuzzle = () => {
  const { curOrder, turns, feedback, switchesActive } = useGameStore(
    (state) => state.puzzleState.lights
  );
  const bottomRef = useRef<HTMLDivElement>(null);
  const puzzleCompleted = useGameStore((state) => state.puzzleCompleted.lights);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [feedback]);

  const handleClick = (switchIndex: number) => {
    if (isSwitchIndex(switchIndex)) {
      const nextTurns = turns + 1;
      const nextFeedback = [
        `You press switch ${switchIndex}`,
        `"That's ${nextTurns} ${nextTurns > 1 ? 'turns"' : 'turn"'}`,
      ];
      const nextOrder = applySwitch[switchIndex](curOrder);
      let nextPuzzleCompleted = false;
      if (isCorrectOrder(nextOrder)) {
        if (nextTurns === 4) {
          nextFeedback.push(...lightsFeedback.optimised);
          nextPuzzleCompleted = true;
        } else {
          nextFeedback.push(...lightsFeedback.subOptimal);
        }
      }

      useGameStore.setState((state) =>
        produce(state, (draft) => {
          draft.puzzleState.lights.curOrder = nextOrder;
          draft.puzzleState.lights.turns = nextTurns;
          draft.puzzleState.lights.feedback.push(...nextFeedback);
          draft.puzzleState.lights.switchesActive = !isCorrectOrder(nextOrder);
          draft.puzzleCompleted.lights = nextPuzzleCompleted;
        })
      );
    }
  };

  const handleReset = () => {
    useGameStore.setState((state) =>
      produce(state, (draft) => {
        draft.puzzleState.lights.curOrder = initialLightsOrder;
        draft.puzzleState.lights.turns = 0;
        draft.puzzleState.lights.switchesActive = true;
        draft.puzzleState.lights.feedback.push(...lightsFeedback.reset);
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
          draft.puzzleState.lights.feedback = initialLightsFeedback;
          draft.puzzleState.lights.curOrder = initialLightsOrder;
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            width: "48rem",
            justifyContent: "space-around",
            padding: "2rem",
          }}
        >
          {curOrder.map((color) => (
            <Box
              key={color}
              sx={{
                color: "black",
                backgroundColor: color,
                borderRadius: "100%",
                height: "6rem",
                width: "6rem",
                textAlign: "center",
                lineHeight: "6rem",
              }}
            >
              {color}
            </Box>
          ))}
        </Box>
        <Card
          sx={{
            width: "80%",
            flex: 1,
            overflowY: "auto",
            whiteSpace: "pre-wrap",
            padding: "1rem",
          }}
        >
          {feedback.map((entry, index) => (
            <Box key={index} sx={{ marginBottom: "1.5rem" }}>
              {entry}
            </Box>
          ))}
          <div ref={bottomRef} />
        </Card>
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
                sx={{ margin: "1rem" }}
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
