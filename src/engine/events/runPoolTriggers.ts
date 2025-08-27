import { produce } from "immer";
import type { PipelineFunction } from "../actions/dispatchCommand";
import { buildRoomDescription } from "../actions/handleLook";

const holeAttemptFeedback: Record<
  "threeFifths" | "threeFourths" | "one" | "fiveFourths",
  string
> = {
  one: "You can't fit through a hole that small!",
  fiveFourths: "You are far too big to fit through a hole that small!",
  threeFifths:
    "You are small enough to fit through the hole but, as it is some distance above the floor of the pool, it is too high for you to reach.",
  threeFourths:
    "You are only just tall enough to reach the hole, and it is a very tight squeeze to enter it",
};

export const runPoolTriggers: PipelineFunction = (payload) => {
  const { command, target, gameState } = payload;
  const { storyLine, playerHeight, currentRoom } = gameState;

  if (currentRoom !== "poolFloor") {
    return payload;
  }

  switch (command) {
    case "look":
      if (target && ["hole", "grate", "grating"].includes(target)) {
        return {
          ...payload,
          gameState: {
            ...gameState,
            storyLine: [
              ...storyLine,
              "Peering into the hole, you see a small tunnel sloping downhill. If only you could get in!",
            ],
          },
          aborted: true,
        };
      }
      break;

    case "move":
      if (target === "in") {
        if (playerHeight === "threeFourths") {
          const nextRoomDescription = buildRoomDescription(
            { ...gameState, currentRoom: "tunnelTop" },
            command
          );
          return {
            ...payload,
            gameState: {
              ...gameState,
              storyLine: [
                ...storyLine,
                holeAttemptFeedback[playerHeight],
                ...nextRoomDescription,
              ],
              currentRoom: "tunnelTop",
            },
            aborted: true,
          };
        } else {
          return {
            ...payload,
            gameState: {
              ...gameState,
              storyLine: [...storyLine, holeAttemptFeedback[playerHeight]],
              success: false,
              feedback: "wrong playerHeight",
            },
            aborted: true,
          };
        }
      }
      break;

    default:
      const newGameState = produce(gameState, (draft) => {
        draft.success = false;
        draft.feedback = "no triggers fired";
      });
      return {
        ...payload,
        gameState: newGameState,
      };
  }

  const newGameState = produce(gameState, (draft) => {
    draft.success = false;
    draft.feedback = "ERROR in runPoolTriggers";
  });
  return {
    ...payload,
    gameState: newGameState,
  };
};
