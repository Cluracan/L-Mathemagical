import type { PipelineFunction } from "../pipeline/types";
import {
  buildRoomDescription,
  toRoomDescriptionArgs,
} from "../utils/buildRoomDescription";
import { produce } from "immer";
import { confiscateItems, sendToJail } from "./runDrogoTriggers";
import { ringFeedback } from "./runRingTriggers";

// Narrative Content
const guardFeedback = {
  capture: {
    isVisible:
      "Before you can do anything the Drogo Robot Guards overpower you. They search you and carry you off.",
    hasAmulet:
      "The guards jump in surprise at the appearance of the Amulet, but quickly overcome you and remove the Amulet, along with all your possessions.  They return the amulet to its place in the room to the west, before carrying you off.",
    dropRing:
      "teleport cupboasrdThe Drogo guards jump in surprise at your sudden appearance amongst them, but quickly gather their wits and overpower you. They take the ring you dropped and carry you off.",
    speak:
      "The Drogo guards jump in surprise at the sound you make, but quickly move to your position and overpower you. They take your items (including your ring) and carry you off.",
  },
};

export const runGuardRoomTriggers: PipelineFunction = (payload) => {
  const { command, target, gameState, nextRoom } = payload;

  if (gameState.currentRoom !== "guards" && nextRoom !== "guards") {
    return payload;
  }

  // Walk into room with amulet
  if (nextRoom === "guards" && gameState.hasAmulet) {
    return produce(payload, (draft) => {
      draft.gameState.currentRoom = nextRoom;
      const args = toRoomDescriptionArgs(draft.gameState);
      const roomDescription = buildRoomDescription(args, "move");
      draft.gameState.storyLine.push(...roomDescription);
      draft.gameState.storyLine.push(guardFeedback.capture.hasAmulet);
      draft.gameState.itemLocation.amulet = "cell";
      draft.gameState.hasAmulet = false;
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
      draft.gameState.storyLine.push(...roomDescription);
      draft.gameState.storyLine.push(guardFeedback.capture.isVisible);
      confiscateItems(draft);
      sendToJail(draft);
      draft.done = true;
    });
  }

  // Drop ring in room
  if (command === "drop" && target === "ring") {
    return produce(payload, (draft) => {
      draft.gameState.storyLine.push(ringFeedback.drop);
      draft.gameState.storyLine.push(guardFeedback.capture.dropRing);
      confiscateItems(draft);
      sendToJail(draft);
      draft.done = true;
    });
  }

  // Talk in room (will be invisible)
  if (command === "say" && target) {
    return produce(payload, (draft) => {
      draft.gameState.storyLine.push(guardFeedback.capture.speak);
      confiscateItems(draft);
      sendToJail(draft);
      draft.done = true;
    });
  }

  return payload;
};
