import { produce } from "immer";
import { createKeyGuard } from "../../../utils/guards";
import {
  INITAL_ORDER,
  lightsFeedback,
  TARGET_ORDER,
  TARGET_TURNS,
  type LightsColor,
  type LightsState,
} from "./lightsConstants";

//Helper Functions
const applySwitch: Record<
  1 | 2 | 3 | 4,
  (colors: LightsColor[]) => LightsColor[]
> = {
  1: (curColors) => [curColors[1], curColors[0], curColors[2], curColors[3]],
  2: (curColors) => [curColors[0], curColors[2], curColors[3], curColors[1]],
  3: (curColors) => curColors,
  4: (curColors) => [curColors[0], curColors[1], curColors[3], curColors[2]],
};

const isSwitchIndex = createKeyGuard(applySwitch);

const isCorrectOrder = (curOrder: string[]) =>
  TARGET_ORDER.every((color, index) => curOrder[index] === color);

export function lightsReducer(
  state: LightsState,
  action: { type: "input"; button: number } | { type: "reset" }
) {
  switch (action.type) {
    case "input": {
      return produce(state, (draft) => {
        if (isSwitchIndex(action.button)) {
          draft.turns++;
          draft.feedback.push(
            `You press switch ${action.button}`,
            `"That's ${draft.turns} ${draft.turns > 1 ? 'turns"' : 'turn"'}`
          );
          const nextOrder = applySwitch[action.button](draft.curOrder);
          if (isCorrectOrder(nextOrder)) {
            draft.switchesActive = false;
            if (draft.turns === TARGET_TURNS) {
              draft.puzzleCompleted = true;
              draft.feedback.push(...lightsFeedback.optimised);
            } else {
              draft.feedback.push(...lightsFeedback.subOptimal);
            }
          }
        }
      });
    }

    case "reset": {
      return produce(state, (draft) => {
        draft.curOrder = [...INITAL_ORDER];
        draft.feedback.push(...lightsFeedback.reset);
        draft.switchesActive = true;
        draft.turns = 0;
      });
    }
  }
}
