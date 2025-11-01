import { produce } from "immer";
import type { PipelineFunction } from "../pipeline/types";
import {
  buildRoomDescription,
  toRoomDescriptionArgs,
} from "../utils/buildRoomDescription";
import { createStoryElements } from "../utils/createStoryElements";

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
      '"You\'ve found it!" exclaims the abbot on seeing the amulet around your neck. "And just in time!". He points up to the window, where you can see a Drogo guard peering out of the window. The abbot deftly flicks the rope ladder and it falls to the floor. He tucks this into his robe, along with the amulet that you pass to him.\n\n"I must leave you now - but you have my eternal thanks for your help!" says the abbot, before hurrying off. You stand and gaze around at the countryside, thinking over your adventure. You have many questions, but these questions will have to remain unanswered for now...',
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
          draft.gameState.storyLine.push({
            type: "action",
            text: cellFeedback.useLadder,
            isEncrypted: draft.gameState.encryptionActive,
          });
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
        console.log(target, playerHasAmulet);
        if (target === "d" && gameState.ladderFixed) {
          return produce(payload, (draft) => {
            if (draft.gameState.ladderFixed) {
              draft.gameState.storyLine.push({
                type: "action",
                text: cellFeedback.exitDown,
                isEncrypted: draft.gameState.encryptionActive,
              });
              draft.gameState.currentRoom = "grounds";
              const args = toRoomDescriptionArgs(draft.gameState);
              const roomDescription = buildRoomDescription(args, "move");
              draft.gameState.storyLine.push(
                ...createStoryElements({
                  type: "description",
                  text: roomDescription,
                  isEncrypted: draft.gameState.encryptionActive,
                })
              );
              // Abbot text
              if (playerHasAmulet) {
                draft.gameState.storyLine.push(
                  ...createStoryElements({
                    type: "description",
                    text: [
                      cellFeedback.abbotText.initial,
                      cellFeedback.abbotText.success,
                    ],
                    isEncrypted: draft.gameState.encryptionActive,
                  })
                );
                draft.gameState.ladderFixed = false;
              } else {
                draft.gameState.storyLine.push(
                  ...createStoryElements({
                    type: "description",
                    text: [
                      cellFeedback.abbotText.initial,
                      cellFeedback.abbotText.failure,
                    ],
                    isEncrypted: draft.gameState.encryptionActive,
                  })
                );
              }
              draft.done = true;
            }
          });
        }
        console.log(target, playerHasAmulet);
        if (target === "e" && playerHasAmulet) {
          return produce(payload, (draft) => {
            draft.gameState.storyLine.push({
              text: cellFeedback.eastWithAmulet,
              type: "warning",
              isEncrypted: draft.gameState.encryptionActive,
            });
            draft.done = true;
          });
        }
      }
      return payload;
  }

  return payload;
};
