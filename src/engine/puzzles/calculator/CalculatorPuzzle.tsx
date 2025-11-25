import { Box, Button, Snackbar, Stack, Typography } from "@mui/material";
import { PuzzleContainer } from "../../../components/puzzles/PuzzleContainer";
import { PuzzleFeedback } from "../../../components/puzzles/PuzzleFeedback";
import { PuzzleHeader } from "../../../components/puzzles/PuzzleHeader";
import { useGameStore } from "../../../store/useGameStore";
import { memo, useCallback } from "react";
import { calculatorReducer } from "./calculatorReducer";
import {
  CALCULATOR_DISPLAY_LENGTH,
  EXP_SIG_FIGS,
  WORKING_CALCULATOR_BUTTONS,
  buttonOrder,
  calculatorButtons,
  calculatorFeedback,
  type InputButton,
  type Token,
} from "./calculatorConstants";

// Types
type InputHandler = (button: InputButton) => void;

interface CalculatorProps {
  handleInput: InputHandler;
}

interface CalculatorButtonProps {
  value: keyof typeof calculatorButtons;
  displayValue: string;
  handleInput: InputHandler;
}

// Helpers
const formatNumber = (value: number) => {
  const valueString = String(value);
  if (valueString.length <= CALCULATOR_DISPLAY_LENGTH) {
    return valueString;
  }

  return value.toExponential(EXP_SIG_FIGS);
};

const formatToken = (token: Token) => {
  return token.type === "operator"
    ? calculatorButtons[token.value].display
    : formatNumber(token.value);
};

const generateDisplay = (tokens: Token[], currentInput: string) => {
  if (tokens.length === 0) {
    return currentInput.slice(0, CALCULATOR_DISPLAY_LENGTH);
  }

  const fullExpression = tokens.map(formatToken).join("") + currentInput;
  return fullExpression.slice(-1 * CALCULATOR_DISPLAY_LENGTH);
};

export const CalculatorPuzzle = () => {
  // State

  const feedback = useGameStore(
    (state) => state.puzzleState.calculator.feedback
  );
  const showFeedback = useGameStore(
    (state) => state.puzzleState.calculator.showFeedback
  );
  const puzzleCompleted = useGameStore(
    (state) => state.puzzleState.calculator.puzzleCompleted
  );

  // Handlers
  const handleInput: InputHandler = useCallback((button) => {
    useGameStore.setState((state) => ({
      ...state,
      puzzleState: {
        ...state.puzzleState,
        calculator: calculatorReducer(state.puzzleState.calculator, {
          type: "input",
          button,
        }),
      },
    }));
  }, []);

  const handleLeave = () => {
    useGameStore.setState((state) => ({
      ...state,
      showDialog: false,
      currentPuzzle: null,
      puzzleState: {
        ...state.puzzleState,
        calculator: {
          ...state.puzzleState.calculator,
          currentInput: "0",
          feedback: calculatorFeedback.default,
          showFeedback: true,
          lastInputType: "evaluate",
          tokens: [],
        },
      },
      storyLine: [
        ...state.storyLine,
        {
          type: "description",
          text: state.puzzleState.calculator.puzzleCompleted
            ? calculatorFeedback.storyLineSuccess
            : calculatorFeedback.storyLineFailure,
          isEncrypted: state.encryptionActive,
        },
      ],
    }));
  };

  const closeFeedback = () => {
    useGameStore.setState((state) => ({
      puzzleState: {
        ...state.puzzleState,
        calculator: { ...state.puzzleState.calculator, showFeedback: false },
      },
    }));
  };

  // Render
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
            height={"auto"}
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

const Calculator = memo(({ handleInput }: CalculatorProps) => {
  return (
    <>
      <Stack
        sx={{
          margin: { md: 2, lg: 4 },
          padding: 3,
          borderRadius: 1,
          backgroundColor: "rgb(251, 241, 122)",
          boxShadow: "inset 1px -1px 4px 2px rgba(107, 102, 31, 0.82)",
        }}
      >
        <CalculatorDisplay />
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
});
Calculator.displayName = "Calculator";

const CalculatorDisplay = memo(() => {
  // State
  const tokens = useGameStore((state) => state.puzzleState.calculator.tokens);
  const currentInput = useGameStore(
    (state) => state.puzzleState.calculator.currentInput
  );

  const calculatorDisplay = generateDisplay(tokens, currentInput);
  // Render
  return (
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
  );
});
CalculatorDisplay.displayName = "CalculatorDisplay";

const CalculatorButton = memo(
  ({ value, displayValue, handleInput }: CalculatorButtonProps) => {
    const buttonDisabled = !WORKING_CALCULATOR_BUTTONS.has(value);
    return (
      <Button
        variant="contained"
        disableRipple={buttonDisabled}
        onClick={() => {
          if (WORKING_CALCULATOR_BUTTONS.has(value)) {
            handleInput(value);
          }
        }}
        sx={{
          height: "3rem",
          border: "3px solid rgb(47, 47, 47)",
          borderRadius: "5px",
          color: "ivory",
          backgroundColor: "rgb(60, 60, 60)",
          boxShadow: " inset 0px 0px 3px 0px #bdbdba",
          fontFamily: "Orbitron",
          lineHeight: "3rem",
          "&:hover": {
            boxShadow: "inset 0px 0px 6px 0px #bdbdba",
          },
        }}
        aria-disabled={buttonDisabled}
      >
        {displayValue}
      </Button>
    );
  }
);
CalculatorButton.displayName = "CalculatorButton";
