import type { PipelineFunction } from "../pipeline/types";
import {
  buildRoomDescription,
  toRoomDescriptionArgs,
} from "../utils/buildRoomDescription";
import { produce } from "immer";
import { confiscateItems, sendToJail } from "./runDrogoTriggers";
import { ringFeedback } from "./runRingTriggers";
import { createStoryElements } from "../utils/createStoryElements";

// Narrative Content
const guardFeedback = {
  capture: {
    isVisible:
      "Before you can do anything the Drogo Robot Guards overpower you. They search you and carry you off.",
    hasAmulet:
      "The guards jump in surprise at the appearance of the Amulet, but quickly overcome you and remove the Amulet, along with all your possessions.  They return the amulet to its place in the room to the west, before carrying you off.",
    dropRing:
      "The Drogo guards jump in surprise at your sudden appearance amongst them, but quickly gather their wits and overpower you. They take the ring you dropped and carry you off.",
    speak:
      "The Drogo guards jump in surprise at the sound you make, but quickly move to your position and overpower you. They take your items (including your ring) and carry you off.",
  },
};

export const runGuardRoomTriggers: PipelineFunction = (payload) => {
  const { command, target, gameState, nextRoom } = payload;

  if (gameState.currentRoom !== "guards" && nextRoom !== "guards") {
    return payload;
  }
  const playerHasAmulet = gameState.itemLocation.amulet === "player";
  // Walk into room with amulet
  if (nextRoom === "guards" && playerHasAmulet) {
    return produce(payload, (draft) => {
      draft.gameState.currentRoom = nextRoom;
      const args = toRoomDescriptionArgs(draft.gameState);
      const roomDescription = buildRoomDescription(args, "move");
      draft.gameState.storyLine.push(
        ...createStoryElements({
          type: "description",
          text: roomDescription,
          isEncrypted: draft.gameState.encryptionActive,
        })
      );
      draft.gameState.storyLine.push({
        type: "warning",
        text: guardFeedback.capture.hasAmulet,
        isEncrypted: draft.gameState.encryptionActive,
      });
      draft.gameState.itemLocation.amulet = "cell";
      confiscateItems(draft);
      sendToJail(draft);
      draft.done = true;
    });
  }
  // Walk visible into room
  if (nextRoom === "guards" && !gameState.isInvisible) {
    return produce(payload, (draft) => {
      draft.gameState.currentRoom = nextRoom;
      const args = toRoomDescriptionArgs(draft.gameState);
      const roomDescription = buildRoomDescription(args, "move");
      draft.gameState.storyLine.push(
        ...createStoryElements({
          type: "description",
          text: roomDescription,
          isEncrypted: draft.gameState.encryptionActive,
        })
      );
      draft.gameState.storyLine.push({
        type: "warning",
        text: guardFeedback.capture.isVisible,
        isEncrypted: draft.gameState.encryptionActive,
      });
      confiscateItems(draft);
      sendToJail(draft);
      draft.done = true;
    });
  }

  // Drop ring in room
  if (command === "drop" && target === "ring") {
    return produce(payload, (draft) => {
      draft.gameState.storyLine.push({
        type: "action",
        text: ringFeedback.drop,
        isEncrypted: draft.gameState.encryptionActive,
      });
      draft.gameState.storyLine.push({
        type: "warning",
        text: guardFeedback.capture.dropRing,
        isEncrypted: draft.gameState.encryptionActive,
      });
      confiscateItems(draft);
      sendToJail(draft);
      draft.done = true;
    });
  }

  // Talk in room (will be invisible)
  if (command === "say" && target) {
    return produce(payload, (draft) => {
      draft.gameState.storyLine.push({
        type: "warning",
        text: guardFeedback.capture.speak,
        isEncrypted: draft.gameState.encryptionActive,
      });
      confiscateItems(draft);
      sendToJail(draft);
      draft.done = true;
    });
  }

  return payload;
};
