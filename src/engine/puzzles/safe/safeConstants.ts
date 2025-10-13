// Types
export interface SafeState {
  puzzleCompleted: boolean;
  value: number;
  resetValueOnNextInput: boolean;
  feedback: {
    isSquare: boolean;
    isCube: boolean;
    isCorrectDigitCount: boolean;
  };
}

export type KeypadButton = (typeof keypadButtons)[number];

// Type Guard
export const isKeypadButton = (digit: number): digit is KeypadButton => {
  return keypadButtons.includes(digit as KeypadButton);
};

// Config
export const DIGIT_COUNT = 4;

// Narrative Content
export const safeFeedback = {
  storyLineSuccess:
    "The safe door has swung open to reveal a passageway going north.",
  storyLineFailure:
    "You step back from the keypad, still wondering what the code is...",
};

export const keypadButtons = [1, 6, 2, 7, 3, 8, 4, 9, 5, 0] as const;

// Initial State
export const initialSafeState: SafeState = {
  puzzleCompleted: false,
  value: 0,
  resetValueOnNextInput: false,
  feedback: {
    isSquare: false,
    isCube: false,
    isCorrectDigitCount: false,
  },
};
