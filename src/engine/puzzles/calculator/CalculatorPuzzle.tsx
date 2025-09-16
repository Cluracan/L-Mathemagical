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
import { memo, useCallback, useMemo } from "react";
import { produce } from "immer";

//Types
type InputType = "number" | "operator" | "evaluate" | "reset";
type InputButton = keyof typeof calculatorButtons;
type HandleInput = (button: InputButton) => void;
type Token =
  | { type: "number"; value: number }
  | { type: "operator"; value: Operator };

export type CalculatorState = {
  currentInput: string;
  feedback: string;
  showFeedback: boolean;
  lastInputType: InputType;
  tokens: Token[];
};

//Type Assertions
function assertIsOperatorToken(
  token: Token
): asserts token is { type: "operator"; value: Operator } {
  if (token.type !== "operator") {
    throw new Error(`Expected an operator but got type ${token.type}`);
  }
}

function assertIsOperator(value: any): asserts value is Operator {
  if (!(value in operatorPrecedence)) {
    throw new Error(`Expected an operator but got ${value}`);
  }
}

//Constants
const INPUT_TARGET = "11";
const WORKING_CALCULATOR_BUTTONS = new Set(["4", "7", "*", "-", "AC", "="]);
const CALCULATOR_DISPLAY_LENGTH = 12;

//Static Data
const calculatorFeedback = {
  instructions:
    "The calculator is very old and many of its keys are broken. The only ones which seem to work are 4, 7, -, *, AC, and =",
  default:
    "The guard watches you carefully as you pick up the calculator, but makes no attempt to stop you.",
  success:
    "The guard gives a shriek of terror, smashes the calculator into tiny fragments, and rushes out through the door.",
  failure:
    "The guard watches you warily, but otherwise seems unaffected by your efforts.",
  storyLineSuccess:
    "You watch as the guard disappears into the distance - now you can leave!",
  storyLineFailure: "You put the calculator down, and ponder what to do next. ",
};

const calculatorButtons = {
  "7": { type: "number", display: "7" },
  "8": { type: "number", display: "8" },
  "9": { type: "number", display: "9" },
  "/": { type: "operator", display: "\u00F7" },
  "4": { type: "number", display: "4" },
  "5": { type: "number", display: "5" },
  "6": { type: "number", display: "6" },
  "*": { type: "operator", display: "\u00D7" },
  "1": { type: "number", display: "1" },
  "2": { type: "number", display: "2" },
  "3": { type: "number", display: "3" },
  "-": { type: "operator", display: "-" },
  AC: { type: "reset", display: "AC" },
  "0": { type: "number", display: "0" },
  "=": { type: "evaluate", display: "=" },
  "+": { type: "operator", display: "+" },
} as const satisfies Record<string, { type: InputType; display: string }>;

const buttonOrder: (keyof typeof calculatorButtons)[] = [
  "7",
  "8",
  "9",
  "/",
  "4",
  "5",
  "6",
  "*",
  "1",
  "2",
  "3",
  "-",
  "0",
  "AC",
  "=",
  "+",
];

//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_precedence
const operatorPrecedence = {
  "+": 11,
  "-": 11,
  "/": 12,
  "*": 12,
};
type Operator = keyof typeof operatorPrecedence;

const calculate = {
  "+": (a: number, b: number) => a + b,
  "-": (a: number, b: number) => a - b,
  "*": (a: number, b: number) => a * b,
  "/": (a: number, b: number) => a / b,
};

//Initial State
export const initialCalculatorState: CalculatorState = {
  currentInput: "0",
  feedback: calculatorFeedback.default,
  showFeedback: true,
  lastInputType: "evaluate",
  tokens: [],
};

//Helper Functions
const isValidInputType = (button: InputButton, lastInputType: InputType) => {
  switch (calculatorButtons[button].type) {
    case "number":
      return true;
    case "operator":
      return lastInputType === "number" || lastInputType === "evaluate";
    case "evaluate":
      return lastInputType === "number";
    case "reset":
      return true;
  }
};

function applyShuntingYard(tokens: Token[]): Token[] {
  const outputQueue = [];
  const operatorStack: Token[] = [];
  while (tokens.length > 0) {
    const curToken = tokens.shift();
    if (curToken?.type === "number") {
      outputQueue.push(curToken);
    } else if (curToken?.type === "operator") {
      while (
        operatorStack.length > 0 &&
        precedence(operatorStack[operatorStack.length - 1]) >=
          precedence(curToken)
      ) {
        outputQueue.push(operatorStack.pop()!);
      }
      operatorStack.push(curToken);
    }
  }
  while (operatorStack.length > 0) {
    outputQueue.push(operatorStack.pop()!);
  }
  return outputQueue;
}

const precedence = (token: Token) => {
  assertIsOperatorToken(token);
  return operatorPrecedence[token.value];
};

function evaluateRPN(tokensRPN: Token[]) {
  const stack: number[] = [];
  let index = 0;
  while (index < tokensRPN.length) {
    const token = tokensRPN[index];
    if (token.type === "number") {
      stack.push(token.value);
    } else {
      if (stack.length < 2)
        throw new Error("Not enough values in stack for operation");
      const rightOperand = stack.pop()!;
      const leftOperand = stack.pop()!;
      const result = calculate[token.value](leftOperand, rightOperand);
      stack.push(result);
    }
    index++;
  }
  if (stack.length !== 1) throw new Error("stack length !==1");
  return stack[0];
}

function calculatorReducer(
  state: CalculatorState,
  action: { type: "input"; button: keyof typeof calculatorButtons }
) {
  //currently only 'input' type available, so no switch wrapper on type
  let { currentInput, feedback, lastInputType, showFeedback } = state;
  let newTokens = [...state.tokens];
  let puzzleCompleted = false;
  const button = action.button;

  if (isValidInputType(action.button, lastInputType)) {
    switch (calculatorButtons[action.button].type) {
      case "number":
        if (lastInputType === "evaluate") {
          currentInput = button;
        } else {
          currentInput += button;
        }
        lastInputType = "number";
        break;
      case "operator":
        assertIsOperator(button);
        newTokens.push({ type: "number", value: parseFloat(currentInput) });
        newTokens.push({ type: "operator", value: button });
        lastInputType = "operator";
        currentInput = "";
        break;
      case "evaluate":
        newTokens.push({ type: "number", value: parseInt(currentInput) });
        const tokensRPN = applyShuntingYard(newTokens);
        currentInput = evaluateRPN(tokensRPN).toString();
        lastInputType = "evaluate";
        newTokens = [];
        if (currentInput === INPUT_TARGET) {
          puzzleCompleted = true;
          feedback = calculatorFeedback.success;
        } else {
          feedback = calculatorFeedback.failure;
        }
        showFeedback = true;
        break;
      case "reset":
        currentInput = "0";
        lastInputType = "evaluate";
        newTokens = [];
    }
  }
  return {
    nextState: {
      ...state,
      currentInput,
      feedback,
      showFeedback,
      lastInputType,
      tokens: newTokens,
    },
    puzzleCompleted,
  };
}

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
    (state) => state.puzzleCompleted.calculator
  );

  const handleInput: HandleInput = useCallback((button) => {
    if (useGameStore.getState().puzzleCompleted.calculator) return;
    useGameStore.setState((state) =>
      produce(state, (draft) => {
        const { nextState, puzzleCompleted } = calculatorReducer(
          draft.puzzleState.calculator,
          { type: "input", button }
        );
        draft.puzzleState.calculator = nextState;

        if (puzzleCompleted) {
          draft.puzzleCompleted.calculator = true;
        }
      })
    );
  }, []);

  const handleLeave = () => {
    useGameStore.setState((state) =>
      produce(state, (draft) => {
        draft.showDialog = false;
        draft.currentPuzzle = null;
        if (state.puzzleCompleted.calculator) {
          draft.storyLine.push(calculatorFeedback.storyLineSuccess);
        } else {
          draft.storyLine.push(calculatorFeedback.storyLineFailure);
        }
      })
    );
  };
  return (
    <>
      <PuzzleContainer>
        <PuzzleHeader
          title="Calculator Puzzle"
          description="display the correct number"
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
        onClose={() =>
          useGameStore.setState((state) =>
            produce(state, (draft) => {
              draft.puzzleState.calculator.showFeedback = false;
            })
          )
        }
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
            .map((entry) =>
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
        m={4}
        padding={"24px"}
        borderRadius={"8px"}
        sx={{
          backgroundColor: "rgb(251, 241, 122)",
          boxShadow: "inset 1px -1px 4px 2px rgba(107, 102, 31, 0.82)",
        }}
      >
        <Typography
          textAlign={"right"}
          lineHeight={2}
          border={"3px solid rgba(71, 71, 71, 1)"}
          borderRadius={1}
          fontSize={"2rem"}
          fontFamily={"DSEG7"}
          px={1}
          py={1}
          my={2}
          sx={{
            color: "rgb(60, 60, 60)",
            backgroundColor: "rgb(189, 212, 189)",
            boxShadow: "inset -10px -5px 64px -32px #2b382e",
          }}
        >
          {calculatorDisplay}
        </Typography>
        <Typography
          fontFamily={"Impact,Arial,Tahoma"}
          variant="overline"
          color="black"
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
          fontFamily: "Orbitron",
          border: "3px solid rgb(47, 47, 47)",
          borderRadius: "5px",
          backgroundColor: "rgb(60, 60, 60)",
          color: "ivory",
          boxShadow: " inset 0px 0px 3px 0px #bdbdba",
          paddingBottom: "4px",
          height: "3rem",
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
