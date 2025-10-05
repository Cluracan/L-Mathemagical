import { produce } from "immer";
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
  let index = 0;
  while (index < tokens.length) {
    const curToken = tokens[index];
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
  action: { type: "input"; button: InputButton }
) {
  if (!isValidInputType(action.button, state.lastInputType)) return state;

  //currently only 'input' type available, so no switch wrapper on type
  const button = action.button;

  switch (calculatorButtons[action.button].type) {
    case "number": {
      return produce(state, (draft) => {
        if (draft.lastInputType === "evaluate") {
          draft.currentInput = button;
        } else {
          draft.currentInput += button;
        }
        draft.lastInputType = "number";
      });
    }
    case "operator": {
      return produce(state, (draft) => {
        assertIsOperator(button);
        draft.tokens.push({
          type: "number",
          value: parseFloat(draft.currentInput),
        });
        draft.tokens.push({ type: "operator", value: button });
        draft.lastInputType = "operator";
        draft.currentInput = "";
      });
    }
    case "evaluate": {
      return produce(state, (draft) => {
        draft.tokens.push({
          type: "number",
          value: parseFloat(draft.currentInput),
        });
        const tokensRPN = applyShuntingYard(draft.tokens);
        const result = evaluateRPN(tokensRPN);
        draft.currentInput = result.toString();
        draft.lastInputType = "evaluate";
        draft.tokens = [];
        if (draft.currentInput === INPUT_TARGET) {
          draft.puzzleCompleted = true;
          draft.feedback = calculatorFeedback.success;
        } else {
          draft.feedback = calculatorFeedback.failure;
        }
        draft.showFeedback = true;
      });
    }
    case "reset": {
      return produce(state, (draft) => {
        draft.currentInput = "0";
        draft.lastInputType = "evaluate";
        draft.tokens = [];
      });
    }
  }
}
