import { isItemId } from "../../assets/data/itemData";
import { itemRegistry } from "../world/itemRegistry";
import type { HandleCommand } from "./dispatchCommand";

export const handleInventory: HandleCommand = (args) => {
  const { gameState, command, target } = args;
  const { itemLocation, storyLine } = gameState;
  const inventoryText = [];
  for (const [item, location] of Object.entries(itemLocation)) {
    if (location === "player" && isItemId(item)) {
      inventoryText.push(itemRegistry.getInventoryDescription(item));
    }
  }
  if (inventoryText.length > 0) {
    return {
      gameState: {
        ...gameState,
        storyLine: [...storyLine, "You are carrying:", ...inventoryText],
      },
      command,
      target,
    };
  } else {
    return {
      gameState: {
        ...gameState,
        storyLine: [...storyLine, "You are not carrying anything!"],
      },
      command,
      target,
    };
  }
};
