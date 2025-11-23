import { produce } from "immer";
import {
  CALCULATOR_DISPLAY_LENGTH,
  INPUT_TARGET,
  calculatorButtons,
  calculatorFeedback,
  getCalculatorFailureMessage,
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
    switch (curToken.type) {
      case "number": {
        outputQueue.push(curToken);
        break;
      }
      case "operator": {
        while (
          operatorStack.length > 0 &&
          precedence(operatorStack[operatorStack.length - 1]) >=
            precedence(curToken)
        ) {
          const operator = operatorStack.pop();
          if (!operator) throw new Error("Unexpected empty operator stack");
          outputQueue.push(operator);
        }
        operatorStack.push(curToken);
      }
    }
    index++;
  }
  while (operatorStack.length > 0) {
    const operator = operatorStack.pop();
    if (!operator) throw new Error("Unexpected empty operator stack");
    outputQueue.push(operator);
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
      const rightOperand = stack.pop();
      const leftOperand = stack.pop();
      if (!rightOperand || !leftOperand)
        throw new Error("Unexpected empty token stack");
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
        } else if (draft.currentInput.length < CALCULATOR_DISPLAY_LENGTH) {
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
          draft.feedback = getCalculatorFailureMessage();
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
