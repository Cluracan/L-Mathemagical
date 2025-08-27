import { produce } from "immer";
import type { PipelineFunction } from "../actions/dispatchCommand";
import { buildRoomDescription } from "../actions/handleLook";
import { failCommand } from "../utils/abortWithCommandFailure";
import { stopWithSuccess } from "../utils/abortWithCommandSuccess";

const holeAttemptFeedback: Record<
  "threeFifths" | "threeFourths" | "one" | "fiveFourths" | "lookHole",
  string
> = {
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
    case "look":
      if (target && ["hole", "grate", "grating"].includes(target)) {
        return stopWithSuccess(payload, holeAttemptFeedback.lookHole);
      }
      break;

    case "move":
      if (target === "in") {
        if (playerHeight === "threeFourths") {
          const nextRoomDescription = buildRoomDescription(
            { ...gameState, currentRoom: "tunnelTop" },
            command
          );
          const nextGameState = produce(gameState, (draft) => {
            draft.currentRoom = "tunnelTop";
            draft.storyLine.push(
              holeAttemptFeedback[playerHeight],
              ...nextRoomDescription
            );
          });
          return {
            ...payload,
            gameState: nextGameState,
            done: true,
          };
        } else {
          return failCommand(
            payload,
            holeAttemptFeedback[playerHeight],
            "wrong playerHeight"
          );
        }
      }
      break;

    default:
      return payload;
  }

  throw new Error("Unexpected code path in runPoolTriggers");
};
