import { produce } from "immer";
import type { PipelineFunction } from "../pipeline/types";
import { DROGO_ID_MAX, DROGO_ID_MIN } from "./runDrogoTriggers";
import type { Command } from "../dispatchCommand";
import {
  buildRoomDescription,
  toRoomDescriptionArgs,
} from "../utils/buildRoomDescription";
import { createStoryElements } from "../utils/createStoryElements";

// Types
export interface JailGuard {
  id: number;
  status: "inactive" | "alert" | "active" | "complete";
}

type GetGuardResponse = (
  command: Command,
  target: string | null,
  status: "inactive" | "alert"
) => { alerted: true; message: string } | { alerted: false };

// Narrative Content
const jailGuardFeedback = {
  inactive: {
    move: "The attic door is securely locked, but as you try the handle, you hear sounds outside...",
    look: "The attic door is securely locked, but as you try the handle, you hear sounds outside...",
    say: "As you speak, you hear sounds outside the locked door...",
  },

  alert: {
    move: "The attic door is locked, but your attempt to open it has alerted a Drogo guard! It unlocks the door and enters the room.",
    look: "You try the door handle, but in doing so alert a Drogo guard! It unlocks the door and enters the room.",
    say: "Your noise has alerted a Drogo guard! It unlocks the door and enters the room.",
  },
  scareAttempt: {
    success: "The guard gives a wail of terror and disappears out of sight.",
    failure: {
      move: "You try to leave the room, but the guard is blocking the exit! It laughs at you and leaves, locking the door behind itself.",
      say: "The guard laughts at you and leaves, locking the door behind itself",
      // default:
      //   "Before you can do anything, the guard swears at you and leaves, locking the door behind itself.",
    },
  },
};

const getJailGuardDescription = (id: number) => {
  return `A Drogo Robot Guard stands in front of you. Emblazoned across its front is the number ${String(id ** 2)}`;
};

// Helpers
const spawnJailGuard = (): JailGuard => {
  const id =
    Math.floor(Math.random() * (DROGO_ID_MAX - DROGO_ID_MIN + 1)) +
    DROGO_ID_MIN;
  return { id, status: "inactive" };
};

const getGuardResponse: GetGuardResponse = (command, target, status) => {
  if (
    command === "move" ||
    (command === "say" && target !== null) ||
    (command === "look" && target === "door")
  ) {
    return { alerted: true, message: jailGuardFeedback[status][command] };
  }
  return { alerted: false };
};

const willScareJailGuard = (target: string | null, jailGuard: JailGuard) => {
  const targetValue = Number(target);
  return !isNaN(targetValue) && targetValue === jailGuard.id;
};

export const runAtticTriggers: PipelineFunction = (payload) => {
  const { command, target, gameState } = payload;
  // Early Exit
  if (gameState.currentRoom !== "attic") {
    return payload;
  }
  if (gameState.jailGuard.status === "complete") {
    return payload;
  }

  const jailGuard = payload.gameState.jailGuard;
  switch (jailGuard.status) {
    case "inactive": {
      const guardResponse = getGuardResponse(command, target, jailGuard.status);
      if (guardResponse.alerted) {
        return produce(payload, (draft) => {
          draft.gameState.storyLine.push({
            type: "action",
            text: guardResponse.message,
            isEncrypted: draft.gameState.encryptionActive,
          });
          draft.gameState.jailGuard.status = "alert";
          draft.done = true;
        });
      }
      break;
    }
    case "alert": {
      const guardResponse = getGuardResponse(command, target, jailGuard.status);
      if (guardResponse.alerted) {
        return produce(payload, (draft) => {
          draft.gameState.storyLine.push({
            type: "action",
            text: guardResponse.message,
            isEncrypted: draft.gameState.encryptionActive,
          });
          draft.gameState.jailGuard.status = "active";
          const guardDescription = getJailGuardDescription(
            draft.gameState.jailGuard.id
          );
          draft.gameState.storyLine.push({
            type: "description",
            text: guardDescription,
            isEncrypted: draft.gameState.encryptionActive,
          });
          draft.done = true;
        });
      }
      break;
    }
    case "active": {
      switch (command) {
        case "say": {
          if (willScareJailGuard(target, jailGuard)) {
            return produce(payload, (draft) => {
              draft.gameState.storyLine.push({
                type: "description",
                text: jailGuardFeedback.scareAttempt.success,
                isEncrypted: draft.gameState.encryptionActive,
              });
              draft.gameState.jailGuard.status = "complete";
              draft.gameState.keyLocked.jail = false;
              draft.done = true;
            });
          } else if (target) {
            return produce(payload, (draft) => {
              draft.gameState.storyLine.push({
                type: "description",
                text: jailGuardFeedback.scareAttempt.failure.say,
                isEncrypted: draft.gameState.encryptionActive,
              });
              draft.gameState.jailGuard.status = "inactive";
              draft.done = true;
            });
          }
          break;
        }
        case "move": {
          return produce(payload, (draft) => {
            draft.gameState.storyLine.push({
              type: "description",
              text: jailGuardFeedback.scareAttempt.failure.move,
              isEncrypted: draft.gameState.encryptionActive,
            });
            draft.gameState.jailGuard.status = "inactive";
            draft.done = true;
          });
        }
        case "look": {
          const jailGuardDescription = getJailGuardDescription(jailGuard.id);
          if (!target) {
            return produce(payload, (draft) => {
              const args = toRoomDescriptionArgs(draft.gameState);
              const roomDescription = buildRoomDescription(args, "look");
              draft.gameState.storyLine.push(
                ...createStoryElements({
                  type: "description",
                  text: [...roomDescription, jailGuardDescription],
                  isEncrypted: draft.gameState.encryptionActive,
                })
              );
              draft.done = true;
            });
          } else if (target === "guard") {
            return produce(payload, (draft) => {
              draft.gameState.storyLine.push({
                type: "description",
                text: jailGuardDescription,
                isEncrypted: draft.gameState.encryptionActive,
              });
              draft.done = true;
            });
          }
          break;
        }
      }
    }
  }
  return payload;
};

// Initial State
export const initialJailGuard: JailGuard = spawnJailGuard();
