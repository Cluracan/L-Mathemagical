import { Box, Button, InputAdornment, Stack, TextField } from "@mui/material";
import React, {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type Ref,
} from "react";
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
import { typedKeys } from "../../../utils/typedKeys";

// Constants
const ingredients = typedKeys(initialCookState.ingredients);

export const CookPuzzle = () => {
  // State
  const puzzleCompleted = useGameStore(
    (state) => state.puzzleState.cook.puzzleCompleted
  );
  const feedback = useGameStore((state) => state.puzzleState.cook.feedback);
  const inputRefs = useRef(
    ingredients.map(() => React.createRef<HTMLInputElement>())
  );
  const [activeInputIndex, setActiveInputIndex] = useState(0);

  // Effects
  useEffect(() => {
    inputRefs.current[activeInputIndex].current?.focus();
  }, [activeInputIndex]);

  // Handlers
  const handleBake = () => {
    useGameStore.setState((state) => ({
      puzzleState: {
        ...state.puzzleState,
        cook: cookReducer(state.puzzleState.cook, { type: "bake" }),
      },
    }));
  };

  const advanceInputFocus = () => {
    if (activeInputIndex === ingredients.length - 1) {
      setActiveInputIndex(0);
      handleBake();
    } else {
      setActiveInputIndex((activeInputIndex) => activeInputIndex + 1);
    }
  };

  const handleReset = () => {
    useGameStore.setState((state) => ({
      puzzleState: {
        ...state.puzzleState,
        cook: cookReducer(state.puzzleState.cook, { type: "reset" }),
      },
    }));
  };

  const handleLeave = () => {
    const state = useGameStore.getState();
    const puzzleCompleted = state.puzzleState.cook.puzzleCompleted;
    useGameStore.setState({
      showDialog: false,
      currentPuzzle: null,
      puzzleState: {
        ...state.puzzleState,
        cook: {
          ...state.puzzleState.cook,
          feedback: cookFeedback.initial,
          ingredients: { TOLT: 0, FIMA: 0, MUOT: 0 },
          cakeHeight: 9,
        },
      },
      storyLine: [
        ...state.storyLine,
        {
          type: "description",
          text: puzzleCompleted
            ? cookFeedback.storyLineSuccess
            : cookFeedback.storyLineFailure,
          isEncrypted: state.encryptionActive,
        },
      ],
      itemLocation: {
        ...state.itemLocation,
        ...(puzzleCompleted && { icosahedron: "player" }),
      },
    });
  };

  // Render
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
          {ingredients.map((ingredient, index) => (
            <InputField
              key={ingredient}
              ingredient={ingredient}
              inputRef={inputRefs.current[index]}
              advanceInputFocus={advanceInputFocus}
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
interface InputFieldProps {
  ingredient: Ingredient;
  inputRef: Ref<HTMLInputElement>;
  advanceInputFocus: () => void;
}

const InputField = ({
  ingredient,
  inputRef,
  advanceInputFocus,
}: InputFieldProps) => {
  // State
  const value = useGameStore(
    (state) => state.puzzleState.cook.ingredients[ingredient]
  );

  // Handlers
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (isNaN(Number(e.target.value)) || Number(e.target.value) > MAX_QUANTITY)
      return;
    useGameStore.setState((state) =>
      produce(state, (draft) => {
        draft.puzzleState.cook.ingredients[ingredient] = Number(e.target.value);
      })
    );
  };

  // Render
  return (
    <>
      <TextField
        inputRef={inputRef}
        onFocus={(e) => {
          e.target.select();
        }}
        variant="outlined"
        label={ingredient}
        value={value}
        onChange={handleChange}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            advanceInputFocus();
          }
        }}
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
  // State
  const cakeHeight = useGameStore((state) => state.puzzleState.cook.cakeHeight);
  const cakeDisplayHeight = (cakeHeight / TARGET_HEIGHT) * 100;

  // Render
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
