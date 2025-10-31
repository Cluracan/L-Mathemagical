import { produce } from "immer";
import { isItemId } from "../../assets/data/itemData";
import { itemRegistry } from "../world/itemRegistry";
import { runPuzzleTriggers } from "../puzzles/runPuzzleTriggers";
import { withPipeline } from "../pipeline/withPipeline";
import type { HandleCommand } from "../dispatchCommand";
import type { PipelineFunction } from "../pipeline/types";
import { createStoryElements } from "../utils/createStoryElements";

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
      storyLine.push(
        ...createStoryElements({
          type: "description",
          text: ["You are carrying:", ...inventoryText],
          isEncrypted: draft.gameState.encryptionActive,
        })
      );
    } else {
      storyLine.push({
        type: "warning",
        text: "You are not carrying anything!",
        isEncrypted: draft.gameState.encryptionActive,
      });
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
