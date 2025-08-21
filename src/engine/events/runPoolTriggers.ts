import type { PipelineFunction } from "../actions/dispatchCommand";
import { buildRoomDescription } from "../actions/handleLook";

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
        switch (playerHeight) {
          case "one":
            return {
              ...payload,
              gameState: {
                ...gameState,
                storyLine: [
                  ...storyLine,
                  "You can't fit through a hole that small!",
                ],
                success: false,
                feedback: "height===1",
              },
              aborted: true,
            };
          case "fiveFourths":
            return {
              ...payload,
              gameState: {
                ...gameState,
                storyLine: [
                  ...storyLine,
                  "You are far too big to fit through a hole that small!",
                ],
                success: false,
                feedback: "height===5/4",
              },
              aborted: true,
            };
          case "threeFifths":
            return {
              ...payload,
              gameState: {
                ...gameState,
                storyLine: [
                  ...storyLine,
                  "You are small enough to fit through the hole but, as it is some distance above the floor of the pool, it is too high for you to reach.",
                ],
                success: false,
                feedback: "height===3/5",
              },
              aborted: true,
            };
          case "threeFourths":
            const nextRoomDescription = buildRoomDescription({
              gameState: { ...gameState, currentRoom: "tunnelTop" },
              command,
            });
            return {
              ...payload,
              gameState: {
                ...gameState,
                storyLine: [
                  ...storyLine,
                  "You are only just tall enough to reach the hole, and it is a very tight squeeze to enter it",
                  ...nextRoomDescription,
                ],
                currentRoom: "tunnelTop",
              },
              aborted: true,
            };

          default:
            return {
              ...payload,
              gameState: {
                ...gameState,
                success: false,
                feedback: "ERROR in runPoolTriggers (default)",
              },
            };
        }
      }
  }
  return {
    ...payload,
    gameState: {
      ...gameState,
      success: false,
      feedback: "ERROR in runPoolTriggers (bottom)",
    },
  };
};
