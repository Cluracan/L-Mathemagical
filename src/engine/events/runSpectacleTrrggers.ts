import { produce } from "immer";
import type { PipelineFunction } from "../pipeline/types";

export const runSpectacletriggers: PipelineFunction = (payload) => {
  const { command, target, gameState } = payload;
  const { encryptionActive, itemLocation, currentRoom } = gameState;
  switch (command) {
    case "move": {
      if (itemLocation.spectacles === currentRoom) {
        return produce(payload, (draft) => {
          draft.gameState.encryptionActive = true;
        });
      } else if (encryptionActive) {
        return produce(payload, (draft) => {
          draft.gameState.encryptionActive = false;
        });
      }
      break;
    }
    case "get": {
      if (target === "spectacles") {
        return produce(payload, (draft) => {
          draft.gameState.encryptionActive = false;
        });
      }
      break;
    }
    case "drop": {
      if (target === "spectacles") {
        return produce(payload, (draft) => {
          draft.gameState.encryptionActive = true;
        });
      }
    }
  }
  return payload;
};
