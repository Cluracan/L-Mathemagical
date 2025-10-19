import { produce } from "immer";
import { initialComputerState, type ComputerState } from "./computerConstants";

import { computerSimulation } from "./computerSimulation";

// Types
type ComputerAction =
  | { type: "submit"; userInput: string; recursionLevel: number }
  | { type: "reset" };

export function computerReducer(state: ComputerState, action: ComputerAction) {
  switch (action.type) {
    case "submit": {
      const nextComputerState = computerSimulation(action.userInput);
      return nextComputerState;
    }
    case "reset": {
      return produce(state, (draft) => {
        const recursionLevel = draft.recursionLevel;
        draft.currentLocation = initialComputerState.currentLocation;
        draft.feedback[recursionLevel] =
          initialComputerState.feedback[recursionLevel];
      });
    }
  }
}
