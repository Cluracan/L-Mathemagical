import {
  INPUT_TARGET,
  calculatorButtons,
  calculatorFeedback,
  type CalculatorState,
  type InputButton,
  type InputType,
  type Operator,
  type Token,
} from "./calculatorConstants";

//Type Assertions
function assertIsOperatorToken(
  token: Token
): asserts token is { type: "operator"; value: Operator } {
  if (token.type !== "operator") {
    throw new Error(`Expected an operator but got type ${token.type}`);
  }
}

function assertIsOperator(value: InputButton): asserts value is Operator {
  if (!(value in operatorPrecedence)) {
    throw new Error(`Expected an operator but got ${value}`);
  }
}

//Constants
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_precedence
const operatorPrecedence = {
  "+": 11,
  "-": 11,
  "/": 12,
  "*": 12,
};

const calculate: Record<Operator, (a: number, b: number) => number> = {
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
  puzzleCompleted: false,
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

export function calculatorReducer(
  state: CalculatorState,
  action: { type: "input"; button: keyof typeof calculatorButtons }
) {
  //currently only 'input' type available, so no switch wrapper on type
  let { currentInput, feedback, lastInputType, showFeedback, puzzleCompleted } =
    state;
  let newTokens = [...state.tokens];
  const button = action.button;

  if (isValidInputType(action.button, lastInputType)) {
    switch (calculatorButtons[action.button].type) {
      case "number": {
        if (lastInputType === "evaluate") {
          currentInput = button;
        } else {
          currentInput += button;
        }
        lastInputType = "number";
        break;
      }
      case "operator": {
        assertIsOperator(button);
        newTokens.push({ type: "number", value: parseFloat(currentInput) });
        newTokens.push({ type: "operator", value: button });
        lastInputType = "operator";
        currentInput = "";
        break;
      }
      case "evaluate": {
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
      }
      case "reset": {
        currentInput = "0";
        lastInputType = "evaluate";
        newTokens = [];
      }
    }
  }
  return {
    ...state,
    currentInput,
    feedback,
    showFeedback,
    lastInputType,
    tokens: newTokens,
    puzzleCompleted,
  };
}
