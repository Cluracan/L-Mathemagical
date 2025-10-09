import { produce } from "immer";
import { isItemId, itemData } from "../../assets/data/itemData";
import type { HandleCommand } from "../dispatchCommand";

export const handleDrink: HandleCommand = (args) => {
  const { gameState, target } = args;
  const { itemLocation, playerHeight } = gameState;
  if (!target) {
    const nextGameState = produce(gameState, (draft) => {
      draft.storyLine.push("Drink what?");
    });
    return nextGameState;
  }

  if (!isItemId(target) || itemLocation[target] !== "player") {
    const nextGameState = produce(gameState, (draft) => {
      draft.storyLine.push("You don't have that...");
    });
    return nextGameState;
  }

  if (!itemData[target].isDrinkable) {
    const nextGameState = produce(gameState, (draft) => {
      draft.storyLine.push("You can't drink that!");
    });
    return nextGameState;
  }

  switch (target) {
    case "bottle":
      if (playerHeight === "threeFifths" || playerHeight === "one") {
        const drinkFeedback = itemData.bottle.drinkMessage[playerHeight];
        const newHeight = itemData.bottle.heightChange[playerHeight];
        const nextGameState = produce(gameState, (draft) => {
          draft.storyLine.push(drinkFeedback);
          draft.playerHeight = newHeight;
          draft.itemLocation.bottle = "pit";
        });
        return nextGameState;
      }
      break;
    case "phial":
      if (playerHeight === "one" || playerHeight === "fiveFourths") {
        const drinkFeedback = itemData.phial.drinkMessage[playerHeight];
        const newHeight = itemData.phial.heightChange[playerHeight];
        const nextGameState = produce(gameState, (draft) => {
          draft.storyLine.push(drinkFeedback);
          draft.playerHeight = newHeight;
          draft.itemLocation.bottle = "pit";
        });
        return nextGameState;
      }
      break;
    default:
      throw new Error("default reached in handleDrink");
  }
  throw new Error("Unexpected code path in handleDrink");
};
