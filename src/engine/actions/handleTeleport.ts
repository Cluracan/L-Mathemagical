import { isRoomId } from "../../assets/data/roomData";
import type { HandleCommand } from "../dispatchCommand";
import { handleLook } from "./handleLook";

export const handleTeleport: HandleCommand = (args) => {
  //TODO: Implement wizMode check or remove this entirely!  Neumann needs to go in special roomCheck for SAY I think.
  const { command, target, gameState } = args;
  if (target && isRoomId(target)) {
    return handleLook({
      gameState: {
        ...gameState,
        feedback: "move",
        visitedRooms: gameState.visitedRooms.add(gameState.currentRoom),
        currentRoom: target,
      },
      command,
      target: null,
    });
  }

  return {
    ...args.gameState,
    success: false,
  };
};
