import { Box, Button, InputAdornment, Stack, TextField } from "@mui/material";
import { produce } from "immer";
import { useGameStore } from "../../../store/useGameStore";
import { PuzzleActions } from "../../../components/puzzles/PuzzleActions";
import { PuzzleContainer } from "../../../components/puzzles/PuzzleContainer";
import { PuzzleHeader } from "../../../components/puzzles/PuzzleHeader";
import { PuzzleFeedback } from "../../../components/puzzles/PuzzleFeedback";
import {
  cookFeedback,
  initialCookState,
  MAX_QUANTITY,
  TARGET_HEIGHT,
  type Ingredient,
} from "./cookConstants";
import { cookReducer } from "./cookReducer";
import type { ChangeEvent } from "react";

export const CookPuzzle = () => {
  const puzzleCompleted = useGameStore(
    (state) => state.puzzleState.cook.puzzleCompleted
  );
  const feedback = useGameStore((state) => state.puzzleState.cook.feedback);

  const handleReset = () => {
    useGameStore.setState((state) => ({
      puzzleState: {
        ...state.puzzleState,
        cook: cookReducer(state.puzzleState.cook, { type: "reset" }),
      },
    }));
  };

  const handleBake = () => {
    useGameStore.setState((state) => ({
      puzzleState: {
        ...state.puzzleState,
        cook: cookReducer(state.puzzleState.cook, { type: "bake" }),
      },
    }));
  };

  const handleLeave = () => {
    const state = useGameStore.getState();
    const puzzleCompleted = state.puzzleState.cook.puzzleCompleted;
    useGameStore.setState({
      showDialog: false,
      currentPuzzle: null,
      puzzleState: { ...state.puzzleState, cook: initialCookState },
      storyLine: [
        ...state.storyLine,
        puzzleCompleted
          ? cookFeedback.storyLineSuccess
          : cookFeedback.storyLineFailure,
      ],
      itemLocation: {
        ...state.itemLocation,
        ...(puzzleCompleted && { icosahedron: "player" }),
      },
    });
  };

  return (
    <>
      <PuzzleContainer>
        <PuzzleHeader
          title="Cake Puzzle"
          description="Bake a cake that reaches 25cm"
        />
        <Stack
          direction={"row"}
          sx={{
            justifyContent: "space-around",
            alignItems: "flex-end",
            width: "80%",
            margin: 2,
            padding: 2,
          }}
        >
          {Object.keys(initialCookState.ingredients).map((ingredient) => (
            <InputField
              key={ingredient}
              ingredient={ingredient as Ingredient}
            />
          ))}
          <CakeDisplay />
        </Stack>
        <PuzzleFeedback feedback={feedback.slice(-20)} height="21vh" />
        <PuzzleActions
          puzzleCompleted={puzzleCompleted}
          handleLeave={handleLeave}
          handleReset={handleReset}
        >
          <Button
            variant="contained"
            size="large"
            disabled={puzzleCompleted}
            onClick={handleBake}
          >
            Bake
          </Button>
        </PuzzleActions>
      </PuzzleContainer>
    </>
  );
};

const InputField = ({ ingredient }: { ingredient: Ingredient }) => {
  const value = useGameStore(
    (state) => state.puzzleState.cook.ingredients[ingredient]
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (isNaN(Number(e.target.value)) || Number(e.target.value) > MAX_QUANTITY)
      return;
    useGameStore.setState((state) =>
      produce(state, (draft) => {
        draft.puzzleState.cook.ingredients[ingredient] = Number(e.target.value);
      })
    );
  };

  return (
    <>
      <TextField
        variant="outlined"
        label={ingredient}
        value={value}
        onChange={handleChange}
        sx={{ width: "96px", m: 2 }}
        slotProps={{
          input: {
            endAdornment: <InputAdornment position="end">g</InputAdornment>,
          },
          htmlInput: { style: { textAlign: "right" }, inputMode: "numeric" },
        }}
      />
    </>
  );
};

const CakeDisplay = () => {
  const cakeHeight = useGameStore((state) => state.puzzleState.cook.cakeHeight);
  const cakeDisplayHeight = (cakeHeight / TARGET_HEIGHT) * 100;
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column-reverse",
        width: "30%",
        height: "12vh",
        borderRight: "4px solid ",
        borderLeft: "4px solid ",
        borderImage:
          "linear-gradient(to top, black 40%, transparent 40%) 1 100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: `${cakeDisplayHeight.toFixed(0)}%`,
          borderTopLeftRadius: "30%",
          borderTopRightRadius: "30%",
          borderBottom: "4px solid black",
          backgroundColor: "#F1D5D1",
          color: "black",
        }}
      >
        {`${cakeHeight.toFixed(1)} cm`}
      </Box>
    </Box>
  );
};
