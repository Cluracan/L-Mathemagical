import { produce } from "immer";
import { isItemId } from "../../assets/data/itemData";
import { itemRegistry } from "../world/itemRegistry";
import { runPuzzleTriggers } from "../puzzles/runPuzzleTriggers";
import { withPipeline } from "../pipeline/withPipeline";
import type { HandleCommand } from "../dispatchCommand";
import type { PipelineFunction } from "../pipeline/types";

export const getInventory: PipelineFunction = (payload) => {
  return produce(payload, (draft) => {
    const itemLocation = draft.gameState.itemLocation;
    const storyLine = draft.gameState.storyLine;
    const inventoryText = [];
    for (const [item, location] of Object.entries(itemLocation)) {
      if (location === "player" && isItemId(item)) {
        inventoryText.push(itemRegistry.getInventoryDescription(item));
      }
    }
    if (inventoryText.length > 0) {
      storyLine.push("You are carrying:", ...inventoryText);
    } else {
      storyLine.push("You are not carrying anything!");
    }
  });
};

const inventoryPipeline = [runPuzzleTriggers, getInventory];

export const handleInventory: HandleCommand = (args) => {
  const { command, target, gameState } = args;
  const payload = {
    command,
    gameState,
    target,
    done: false,
  };

  return withPipeline(payload, inventoryPipeline);
};
