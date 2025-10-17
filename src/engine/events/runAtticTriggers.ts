import { produce } from "immer";
import type { PipelineFunction } from "../pipeline/types";
import { DROGO_ID_MAX, DROGO_ID_MIN } from "./runDrogoTriggers";

// Types
export type JailGuard = {
  id: number;
  state: "inactive" | "alert" | "present";
  completed: boolean;
};

// Narrative Content
const jailGuardFeedback = {
  tryDoor:
    "The attic door is securely locked, but as you try the handle, you hear sounds outside...",
  scareAttempt: {
    success: "The guard gives a wail of terror and disappears out of sight.",
    failure:
      "The guard swears at you and leaves, locking the door behind itself.",
  },
};

const getJailGuardDescription = (id: number) => {
  return `A Drogo Robot Guard comes into the room with some food. Emblazoned across its front is the number ${String(id ** 2)}`;
};

// Helpers
const spawnJailGuard = (): JailGuard => {
  const id =
    Math.floor(Math.random() * (DROGO_ID_MAX - DROGO_ID_MIN + 1)) +
    DROGO_ID_MIN;
  return { id, state: "inactive", completed: false };
};

const willScareJailGuard = (target: string, jailGuard: JailGuard) => {
  const targetValue = Number(target);
  return !isNaN(targetValue) && targetValue === jailGuard.id;
};

export const runAtticTriggers: PipelineFunction = (payload) => {
  const { command, target, gameState } = payload;
  // Early Exit
  if (gameState.currentRoom !== "attic") {
    return payload;
  }
  if (gameState.jailGuard.completed) {
    return payload;
  }

  // Guard present
  const jailGuard = payload.gameState.jailGuard;
  switch (jailGuard.state) {
    case "present": {
      return produce(payload, (draft) => {
        if (
          command === "say" &&
          target &&
          willScareJailGuard(target, jailGuard)
        ) {
          draft.gameState.storyLine.push(
            jailGuardFeedback.scareAttempt.success
          );
          draft.gameState.jailGuard.completed = true;
          draft.gameState.keyLocked.jail = false;
          draft.done = true;
        } else {
          draft.gameState.storyLine.push(
            jailGuardFeedback.scareAttempt.failure
          );
          draft.gameState.jailGuard = spawnJailGuard();
          draft.done = true;
        }
      });
    }

    case "alert": {
      return produce(payload, (draft) => {
        draft.gameState.storyLine.push(getJailGuardDescription(jailGuard.id));
        draft.gameState.jailGuard.state = "present";
        draft.done = true;
      });
    }

    case "inactive": {
      if (
        (command === "move" && target === "e") ||
        (command === "look" && target === "door")
      ) {
        return produce(payload, (draft) => {
          draft.gameState.storyLine.push(jailGuardFeedback.tryDoor);
          draft.gameState.jailGuard.state = "alert";
          draft.done = true;
        });
      }
      break;
    }
  }
  return payload;
};

// Initial State
export const initialJailGuard: JailGuard = spawnJailGuard();
