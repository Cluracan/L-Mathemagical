import {
  Box,
  Button,
  Snackbar,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { PuzzleContainer } from "../../../components/puzzles/PuzzleContainer";
import { PuzzleFeedback } from "../../../components/puzzles/PuzzleFeedback";
import { PuzzleHeader } from "../../../components/puzzles/PuzzleHeader";
import { useGameStore } from "../../../store/useGameStore";
import { produce } from "immer";
import { memo, useCallback, useMemo } from "react";
import { calculatorReducer, initialCalculatorState } from "./calculatorLogic";
import {
  CALCULATOR_DISPLAY_LENGTH,
  WORKING_CALCULATOR_BUTTONS,
  buttonOrder,
  calculatorButtons,
  calculatorFeedback,
  type InputButton,
  type Token,
} from "./calculatorConstants";

//Types
type HandleInput = (button: InputButton) => void;

//Main Component
export const CalculatorPuzzle = () => {
  const theme = useTheme();
  const feedback = useGameStore(
    (state) => state.puzzleState.calculator.feedback
  );
  const showFeedback = useGameStore(
    (state) => state.puzzleState.calculator.showFeedback
  );
  const puzzleCompleted = useGameStore(
    (state) => state.puzzleState.calculator.puzzleCompleted
  );

  const handleInput: HandleInput = useCallback((button) => {
    useGameStore.setState((state) =>
      produce(state, (draft) => {
        draft.puzzleState.calculator = calculatorReducer(
          draft.puzzleState.calculator,
          {
            type: "input",
            button,
          }
        );
      })
    );
  }, []);

  const handleLeave = () => {
    useGameStore.setState((state) =>
      produce(state, (draft) => {
        draft.showDialog = false;
        draft.currentPuzzle = null;
        if (state.puzzleState.calculator.puzzleCompleted) {
          draft.storyLine.push(calculatorFeedback.storyLineSuccess);
        } else {
          draft.puzzleState.calculator = initialCalculatorState;
          draft.storyLine.push(calculatorFeedback.storyLineFailure);
        }
      })
    );
  };

  const closeFeedback = () => {
    useGameStore.setState((state) =>
      produce(state, (draft) => {
        draft.puzzleState.calculator.showFeedback = false;
      })
    );
  };

  return (
    <>
      <PuzzleContainer>
        <PuzzleHeader
          title="Calculator Puzzle"
          description="Display the correct number"
        />
        <Calculator handleInput={handleInput} />
        <Stack
          direction={"row"}
          width={"90%"}
          sx={{ justifyContent: "space-between" }}
        >
          <PuzzleFeedback
            feedback={[calculatorFeedback.instructions]}
            height={theme.spacing(13)}
          />
          <Button
            onClick={handleLeave}
            color={puzzleCompleted ? "success" : "primary"}
          >
            Leave
          </Button>
        </Stack>
      </PuzzleContainer>
      <Snackbar
        open={showFeedback}
        onClose={closeFeedback}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        message={feedback}
      />
    </>
  );
};

type CalculatorProps = { handleInput: HandleInput };
const Calculator = ({ handleInput }: CalculatorProps) => {
  const { tokens, currentInput } = useGameStore(
    (state) => state.puzzleState.calculator
  );

  const calculatorDisplay = useMemo(() => {
    return tokens.length > 0
      ? (
          tokens
            .map((entry: Token) =>
              entry.type === "operator"
                ? calculatorButtons[entry.value].display
                : Math.round(entry.value * 1000) / 1000
            )
            .join("") + currentInput
        ).slice(-1 * CALCULATOR_DISPLAY_LENGTH)
      : currentInput.slice(0, CALCULATOR_DISPLAY_LENGTH);
  }, [tokens, currentInput]);

  return (
    <>
      <Stack
        sx={{
          margin: 4,
          padding: 3,
          borderRadius: 1,
          backgroundColor: "rgb(251, 241, 122)",
          boxShadow: "inset 1px -1px 4px 2px rgba(107, 102, 31, 0.82)",
        }}
      >
        <Typography
          sx={{
            px: 1,
            py: 1,
            my: 2,
            border: "3px solid rgba(71, 71, 71, 1)",
            borderRadius: 1,
            color: "rgb(60, 60, 60)",
            backgroundColor: "rgb(189, 212, 189)",
            boxShadow: "inset -10px -5px 64px -32px #2b382e",
            fontFamily: "DSEG7",
            fontSize: "2rem",
            lineHeight: 2,
            textAlign: "right",
          }}
        >
          {calculatorDisplay}
        </Typography>
        <Typography
          sx={{
            fontFamily: "Impact,Arial,Tahoma",
            variant: "overline",
            color: "black",
          }}
        >
          CASIO MICRO MINI
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: "1rem",
          }}
        >
          {buttonOrder.map((value) => (
            <CalculatorButton
              key={value}
              value={value}
              displayValue={calculatorButtons[value].display}
              handleInput={handleInput}
            />
          ))}
        </Box>
      </Stack>
    </>
  );
};

type CalculatorButtonProps = {
  value: keyof typeof calculatorButtons;
  displayValue: string;
  handleInput: HandleInput;
};
const CalculatorButton = memo(
  ({ value, displayValue, handleInput }: CalculatorButtonProps) => {
    return (
      <Button
        variant="contained"
        disableRipple={!WORKING_CALCULATOR_BUTTONS.has(value)}
        onClick={() =>
          WORKING_CALCULATOR_BUTTONS.has(value) && handleInput(value)
        }
        sx={{
          height: "3rem",
          paddingBottom: "4px",
          border: "3px solid rgb(47, 47, 47)",
          borderRadius: "5px",
          color: "ivory",
          backgroundColor: "rgb(60, 60, 60)",
          boxShadow: " inset 0px 0px 3px 0px #bdbdba",
          fontFamily: "Orbitron",
          "&:hover": {
            boxShadow: "inset 0px 0px 6px 0px #bdbdba",
          },
        }}
      >
        {displayValue}
      </Button>
    );
  }
);
