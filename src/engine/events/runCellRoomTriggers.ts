import { produce } from "immer";
import type { PipelineFunction } from "../pipeline/types";
import {
  buildRoomDescription,
  toRoomDescriptionArgs,
} from "../utils/buildRoomDescription";

// Narrative Content
const cellFeedback = {
  useLadder:
    "You fix the rope ladder to the window frame, and are relieved to see that it is long enough to reach the ground below.",
    eastWithAmulet:
    "A mysterious force prevents you from moving East. You sense it is coming from the Amulet.",
    exitDown: "You clamber out of the window, and climb down the ladder.",
  };

export const runCellRoomTriggers: PipelineFunction = (payload) => {
  const { command, target, gameState } = payload;
  const { itemLocation, currentRoom } = gameState;
  if (currentRoom !== "cell") {
    return payload;
  }

  switch (command) {
    case "use": {
      if (target === "ladder" && itemLocation.ladder === "player") {
        return produce(payload, (draft) => {
          draft.gameState.storyLine.push(cellFeedback.useLadder);
          draft.gameState.ladderFixed = true;
          draft.gameState.itemLocation.ladder = "pit";
          draft.done = true;
        });
      }
      break;
    }
    case "move":
      {
        if (target === "d" && gameState.ladderFixed) {
          return produce(payload, (draft) => {
            if (draft.gameState.ladderFixed) {
              draft.gameState.storyLine.push(cellFeedback.exitDown);
              draft.gameState.currentRoom = "countryside";
              const args = toRoomDescriptionArgs(draft.gameState);
              const roomDescription = buildRoomDescription(args, "move");
              draft.gameState.storyLine.push(...roomDescription);
              draft.done = true;
            }
          });
        }
        const playerHasAmulet = gameState.itemLocation.amulet === "player";
        if (target === "e" && playerHasAmulet) {
          return produce(payload, (draft) => {
            draft.gameState.storyLine.push(cellFeedback.eastWithAmulet);
            draft.done = true
          });
        }
      }
      return payload;
  }

  return payload;
};
