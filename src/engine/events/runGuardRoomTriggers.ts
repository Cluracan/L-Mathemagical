import { produce } from "immer";
import type { PipelineFunction } from "../pipeline/types";

import { confiscateItems, sendToJail } from "./runDrogoTriggers";
import { buildRoomDescription } from "../utils/buildRoomDescription";

// Narrative Content
const guardFeedback = {
  capture: {
    onEntry:
      "But before you can do anything the Drogo Robot Guards overpower you. They search you and carry you off.",
  },
};

export const runGuardRoomTriggers: PipelineFunction = (payload) => {
  const { command, target, gameState } = payload;
  if (gameState.currentRoom !== "guards") {
    return payload;
  }
  if (!gameState.isInvisible) {
    return produce(payload, (draft) => {
      draft.gameState.storyLine.push(
        ...buildRoomDescription(draft.gameState, "move")
      );
      draft.gameState.storyLine.push(guardFeedback.capture.onEntry);
      confiscateItems(draft);
      sendToJail(draft);
    });
  }

  console.log({ command, target });
  return payload;
};
