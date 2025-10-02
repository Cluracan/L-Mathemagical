import { produce } from "immer";
import type { TelephoneState } from "./telephoneConstants";

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
      if (state.number > 99) return state;
      return produce(state, (draft) => {
        draft.number = (draft.number * 10 + action.value) % 1000;
      });
  }
  return state;
}
