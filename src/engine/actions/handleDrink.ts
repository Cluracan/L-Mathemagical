import { isItemId, itemData } from "../../assets/data/itemData";
import type { HandleCommand } from "./dispatchCommand";

export const handleDrink: HandleCommand = (args) => {
  const { gameState, target } = args;
  const { itemLocation } = gameState;
  if (!target)
    return { ...gameState, storyLine: [...gameState.storyLine, "Drink what?"] };

  if (!isItemId(target) || itemLocation[target] !== "player") {
    return {
      ...gameState,
      storyLine: [...gameState.storyLine, "You don't have that..."],
    };
  }

  if (!itemData[target].isDrinkable) {
    return {
      ...gameState,
      storyLine: [...gameState.storyLine, "You can't drink that!"],
    };
  }

  const playerHeight = gameState.playerHeight;
  const getValue = <T extends Record<string, string>, K extends keyof T>(
    obj: T,
    key: K
  ): T[K] => {
    return obj[key];
  };

  switch (target) {
    case "bottle":
      if (playerHeight === "threeFifths" || playerHeight === "one") {
        const drinkMessage = getValue(
          itemData[target].drinkMessage,
          playerHeight
        );
        const newHeight = getValue(itemData[target].heightChange, playerHeight);
        return {
          ...gameState,
          itemLocation: { ...itemLocation, bottle: "pit" },
          playerHeight: newHeight,
          storyLine: [...gameState.storyLine, drinkMessage],
        };
      }
      break;
    case "phial":
      if (playerHeight === "one" || playerHeight === "fiveFourths") {
        const drinkMessage = getValue(
          itemData[target].drinkMessage,
          playerHeight
        );
        const newHeight = getValue(itemData[target].heightChange, playerHeight);
        return {
          ...gameState,
          itemLocation: { ...itemLocation, bottle: "pit" },
          playerHeight: newHeight,
          storyLine: [...gameState.storyLine, drinkMessage],
        };
      }
      break;
    default:
      return {
        ...gameState,
        storyLine: [
          ...gameState.storyLine,
          "That's strange - nothing happened!",
        ],
      };
  }
  return gameState;
  //this last return is just to satisfy typescript, which is being super conservative
};
