import { isRoomId } from "../../assets/data/roomData";
import type { HandleCommand } from "./dispatchCommand";
import { handleLook } from "./handleLook";

export const handleTeleport: HandleCommand = ({ target, gameState }) => {
  //TODO: Implement wizMode check or remove this entirely!  Neumann needs to go in special roomCheck for SAY I think.

  if (target && isRoomId(target)) {
    return handleLook({
      target: null,
      gameState: { ...gameState, currentRoom: target },
    });
  }

  return gameState;
};
