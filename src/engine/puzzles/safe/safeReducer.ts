import { produce } from "immer";
import { DIGIT_COUNT, initialSafeState, type SafeState } from "./safeConstants";

//Types
type SafeAction =
  | { type: "input"; value: number }
  | { type: "reset" }
  | { type: "test" };

//Helper Functions
const getDigitCount = (value: number) => {
  return value === 0 ? 1 : Math.floor(Math.log10(value)) + 1; // Works for value>=0
};

export const safeReducer = (state: SafeState, action: SafeAction) => {
  switch (action.type) {
    case "input": {
      return produce(state, (draft) => {
        if (draft.resetValueOnNextInput) {
          draft.value = action.value;
          draft.resetValueOnNextInput = false;
        } else if (getDigitCount(draft.value) < DIGIT_COUNT) {
          draft.value = draft.value * 10 + action.value;
        }
      });
    }
    case "test": {
      return produce(state, (draft) => {
        draft.feedback.isSquare = Number.isInteger(Math.sqrt(draft.value));
        draft.feedback.isCube = Number.isInteger(Math.cbrt(draft.value));
        draft.feedback.isCorrectDigitCount =
          getDigitCount(draft.value) === DIGIT_COUNT;
        draft.puzzleCompleted =
          draft.feedback.isSquare &&
          draft.feedback.isCube &&
          draft.feedback.isCorrectDigitCount;
        draft.resetValueOnNextInput = true;
      });
    }
    case "reset": {
      return initialSafeState;
    }
    default: {
      return state;
    }
  }
};
