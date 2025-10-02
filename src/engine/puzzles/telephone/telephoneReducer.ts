import { produce } from "immer";
import {
  hasReply,
  INITIAL_NUMBER,
  TARGET_NUMBER,
  telephoneFeedback,
  type TelephoneState,
} from "./telephoneConstants";

//Types
type TelephoneAction =
  | { type: "input"; value: number }
  | { type: "submit" }
  | { type: "reset" };

export function telephoneReducer(
  state: TelephoneState,
  action: TelephoneAction
) {
  switch (action.type) {
    case "input":
      if (state.number >= 100) return state;
      return produce(state, (draft) => {
        draft.number = (draft.number * 10 + action.value) % 1000;
      });
    case "reset":
      return produce(state, (draft) => {
        draft.number = INITIAL_NUMBER;
      });
    case "submit":
      return produce(state, (draft) => {
        draft.feedback.push(
          `You dial ${draft.number.toString().padStart(3, "0")}`
        );
        if (!hasReply(draft.number)) {
          draft.feedback.push(telephoneFeedback.noReply);
        } else if (draft.number === TARGET_NUMBER) {
          if (draft.targetNumberIsEngaged) {
            draft.feedback.push(telephoneFeedback.reply[draft.number]);
            draft.targetNumberIsEngaged = false;
          } else {
            draft.feedback.push(telephoneFeedback.success);
            draft.puzzleCompleted = true;
          }
        } else if (hasReply(draft.number)) {
          draft.feedback.push(telephoneFeedback.reply[draft.number]);
        }
        draft.number = INITIAL_NUMBER;
      });
  }
  return state;
}
