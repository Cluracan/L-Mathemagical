//Types
export type InputType = "number" | "operator" | "evaluate" | "reset";
export type Token =
  | { type: "number"; value: number }
  | { type: "operator"; value: Operator };
export type Operator = "+" | "-" | "*" | "/";
export type InputButton = keyof typeof calculatorButtons;

export interface CalculatorState {
  currentInput: string;
  feedback: string;
  showFeedback: boolean;
  lastInputType: InputType;
  tokens: Token[];
  puzzleCompleted: boolean;
}

//Constants
export const INPUT_TARGET = "11";
export const WORKING_CALCULATOR_BUTTONS = new Set([
  "4",
  "7",
  "*",
  "-",
  "AC",
  "=",
]);
export const CALCULATOR_DISPLAY_LENGTH = 11;

//Static Data
export const calculatorFeedback = {
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

export const calculatorButtons = {
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

export const buttonOrder: (keyof typeof calculatorButtons)[] = [
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

//Initial State
export const initialCalculatorState: CalculatorState = {
  currentInput: "0",
  feedback: calculatorFeedback.default,
  showFeedback: true,
  lastInputType: "evaluate",
  tokens: [],
  puzzleCompleted: false,
};
