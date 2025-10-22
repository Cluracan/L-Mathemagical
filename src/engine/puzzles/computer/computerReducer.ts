import { produce } from "immer";
import {
  computerFeedback,
  initialComputerState,
  isRecursionLevel,
  type ComputerState,
} from "./computerConstants";

import { computerSimulation } from "./computerSimulation";
import type { KeyId } from "../../../assets/data/itemData";

// Types
type ComputerAction =
  | {
      type: "submit";
      userInput: string;
      recursionLevel: number;
      keyLocked: Record<KeyId, boolean>;
    }
  | { type: "reset" }
  | { type: "leave" };

export function computerReducer(state: ComputerState, action: ComputerAction) {
  switch (action.type) {
    case "submit": {
      const nextComputerState = computerSimulation(
        action.userInput,
        action.keyLocked
      );
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
    case "leave": {
      return produce(state, (draft) => {
        const recursionLevel = draft.recursionLevel;
        if (!isRecursionLevel(recursionLevel)) {
          throw new Error(
            `Expected valid recursion level, received ${String(recursionLevel)}`
          );
        }
        draft.currentLocation = "computer";
        draft.feedback[recursionLevel] = [
          computerFeedback.hallwayDescription,
          computerFeedback.recursionEntrance[recursionLevel],
        ];
        draft.feedback[recursionLevel - 1].push(
          computerFeedback.storyLineSuccess
        );
        draft.recursionLevel--;
      });
    }
  }
}
