import { produce } from "immer";
import {
  cookFeedback,
  getCakeHeightFeedback,
  getFailureFeedback,
  initialCookState,
  MIN_HEIGHT,
  TARGET_HEIGHT,
  type CookState,
  type Ingredient,
} from "./cookConstants";

type CookAction = { type: "bake" } | { type: "reset" };
export function cookReducer(state: CookState, action: CookAction) {
  switch (action.type) {
    case "bake": {
      return produce(state, (draft) => {
        draft.cakeHeight = calculateCakeHeight(draft.ingredients);
        draft.feedback.push(
          ...getCakeHeightFeedback(draft.ingredients, draft.cakeHeight)
        );
        if (draft.cakeHeight < TARGET_HEIGHT) {
          draft.feedback.push(getFailureFeedback(draft.cakeHeight));
        } else {
          draft.feedback.push(...cookFeedback.success);
          draft.puzzleCompleted = true;
        }
      });
    }
    case "reset": {
      return produce(state, (draft) => {
        draft.feedback.push("You quickly clean a bowl, and begin again.");
        draft.ingredients = initialCookState.ingredients;
      });
    }
  }
}

//MUOT deliberately unused in original recipe
function calculateCakeHeight({ TOLT, FIMA, MUOT }: Record<Ingredient, number>) {
  const cakeHeight =
    26 - 0.5 * (TOLT - 6) ** 2 - 0.45 * (FIMA - 14) ** 2 - 0 * (MUOT - 0) ** 2;
  return cakeHeight > MIN_HEIGHT ? cakeHeight : MIN_HEIGHT;
}
