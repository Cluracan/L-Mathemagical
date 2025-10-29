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
  abbotText: {
    initial:
      "The abbot is sitting on a bench under a pear tree. As he sees you climb down, he hurries over to meet you.",
    success:
      '"You\'ve found it!" exclaims the abbot on seeing the amulet around your neck. "And just in time!". He points up to the window, where you can see a Drogo guard peering out of the window. The abbot deftly flicks the rope ladder and it falls to the floor. He tucks this into his robe, along with the amulet that you pass to him.',
    failure:
      '"You don\'t have the amulet!" cries the abbot. "Please, do go back and collect it!"',
  },
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
        const playerHasAmulet = gameState.itemLocation.amulet === "player";
        if (target === "d" && gameState.ladderFixed) {
          return produce(payload, (draft) => {
            if (draft.gameState.ladderFixed) {
              draft.gameState.storyLine.push(cellFeedback.exitDown);
              draft.gameState.currentRoom = "grounds";
              const args = toRoomDescriptionArgs(draft.gameState);
              const roomDescription = buildRoomDescription(args, "move");
              draft.gameState.storyLine.push(...roomDescription);
              // Abbot text
              if (playerHasAmulet) {
                draft.gameState.storyLine.push(
                  cellFeedback.abbotText.initial,
                  cellFeedback.abbotText.success
                );
                draft.gameState.ladderFixed = false;
              } else {
                draft.gameState.storyLine.push(
                  cellFeedback.abbotText.initial,
                  cellFeedback.abbotText.failure
                );
              }
              draft.done = true;
            }
          });
        }
        if (target === "e" && playerHasAmulet) {
          return produce(payload, (draft) => {
            draft.gameState.storyLine.push(cellFeedback.eastWithAmulet);
            draft.done = true;
          });
        }
      }
      return payload;
  }

  return payload;
};
