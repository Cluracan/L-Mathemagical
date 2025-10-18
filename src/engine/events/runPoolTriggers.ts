import type { PipelineFunction } from "../pipeline/types";
import {
  buildRoomDescription,
  toRoomDescriptionArgs,
} from "../utils/buildRoomDescription";
import { produce } from "immer";
import { failCommand } from "../pipeline/failCommand";
import { stopWithSuccess } from "../pipeline/stopWithSuccess";

const holeAttemptFeedback = {
  one: "You can't fit through a hole that small!",
  fiveFourths: "You are far too big to fit through a hole that small!",
  threeFifths:
    "You are small enough to fit through the hole but, as it is some distance above the floor of the pool, it is too high for you to reach.",
  threeFourths:
    "You are only just tall enough to reach the hole, and it is a very tight squeeze to enter it",
  lookHole:
    "Peering into the hole, you see a small tunnel sloping downhill. If only you could get in!",
};

export const runPoolTriggers: PipelineFunction = (payload) => {
  const { command, target, gameState } = payload;
  const { playerHeight, currentRoom } = gameState;

  if (currentRoom !== "poolFloor") {
    return payload;
  }

  switch (command) {
    case "look": {
      if (target && ["hole", "grate", "grating"].includes(target)) {
        return stopWithSuccess(payload, holeAttemptFeedback.lookHole);
      }
      break;
    }

    case "move": {
      if (target === "in") {
        if (playerHeight !== "threeFourths") {
          return failCommand(payload, holeAttemptFeedback[playerHeight]);
        }
        return produce(payload, (draft) => {
          draft.gameState.currentRoom = "tunnelTop";
          const args = toRoomDescriptionArgs(draft.gameState);
          const nextRoomDescription = buildRoomDescription(args, command);
          draft.gameState.storyLine.push(
            holeAttemptFeedback[playerHeight],
            ...nextRoomDescription
          );
          draft.done = true;
        });
      }
      break;
    }

    default:
      return payload;
  }
  return payload;
};
