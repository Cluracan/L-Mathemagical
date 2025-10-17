import { produce } from "immer";
import type { PipelineFunction } from "../pipeline/types";

import { confiscateItems, sendToJail } from "./runDrogoTriggers";
import { buildRoomDescription } from "../utils/buildRoomDescription";
import { ringFeedback } from "./runRingTriggers";

// Narrative Content
const guardFeedback = {
  capture: {
    onEntry:
      "Before you can do anything the Drogo Robot Guards overpower you. They search you and carry you off.",
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

  // Walk visible into room
  if (nextRoom === "guards" && !gameState.isInvisible) {
    return produce(payload, (draft) => {
      draft.gameState.currentRoom = nextRoom;
      draft.gameState.storyLine.push(
        ...buildRoomDescription(draft.gameState, "move")
      );
      draft.gameState.storyLine.push(guardFeedback.capture.onEntry);
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

  // Talk in room (should be invisible)
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
