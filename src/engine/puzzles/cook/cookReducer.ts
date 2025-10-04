import { produce } from "immer";
import {
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
        const { TOLT, FIMA, MUOT } = draft.ingredients;
        const nextCakeHeight = calculateCakeHeight(draft.ingredients);
        draft.feedback.push(
          " ",
          `The cook adds ${TOLT}g of TOLT, ${FIMA}g of FIMA, and ${MUOT}g of MUOT to the mixture, places it into the oven and after a few minutes takes out the cake.`
        );
        if (nextCakeHeight === MIN_HEIGHT) {
          draft.feedback.push(
            `The cake is only ${MIN_HEIGHT}cm high and doesn't seem to have risen at all.`,
            '"Oh no!", cries the cook. "Will you try again?'
          );
        } else if (nextCakeHeight < 0.7 * MIN_HEIGHT + 0.3 * TARGET_HEIGHT) {
          draft.feedback.push(
            `The cake has risen to ${nextCakeHeight}cm...`,
            '"Well it\'s a start" beams the cook. "Please keep going!'
          );
        } else if (nextCakeHeight < 0.3 * MIN_HEIGHT + 0.7 * TARGET_HEIGHT) {
          draft.feedback.push(
            `The cake is ${nextCakeHeight}cm high.`,
            '"That\'s getting better", says the cook. "Will you try again?"'
          );
        } else if (nextCakeHeight < TARGET_HEIGHT) {
          draft.feedback.push(
            `The cake has risen to the height of  ${nextCakeHeight}cm.`,
            '"So close!", cries the cook. "Please keep trying!"'
          );
        } else {
          draft.feedback.push(
            `It has risen to a height of ${nextCakeHeight}cm.`,
            '"Thenk goodness!" beams the cook, tasting the cake. "It\'s rather salty, but it\'s just the right size."',
            'The cook fumbles in a drawer and hands something to you. "I found this yesterday. It\'s of not use to me." You are holding an icosahedron made of highly polished jade'
          );
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
  return cakeHeight > MIN_HEIGHT
    ? Math.round(cakeHeight * 10) / 10
    : MIN_HEIGHT;
}
