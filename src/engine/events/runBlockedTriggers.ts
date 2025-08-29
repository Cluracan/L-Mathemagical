import {
  isBlockedRoom,
  blockedExitData,
} from "../../assets/data/blockedExitData";
import type { PipelineFunction } from "../dispatchCommand";
import { failCommand } from "../utils/failCommand";

export const runBlockedTriggers: PipelineFunction = (payload) => {
  const { currentRoom, keyLocked } = payload.gameState;
  const target = payload.target;
  //blocked room check
  if (isBlockedRoom(currentRoom) && target) {
    const blockedDirections: string[] = blockedExitData[currentRoom].direction;
    const keyRequired = blockedExitData[currentRoom].keyRequired;
    //check attempting to use blocked exit
    if (blockedDirections.includes(target)) {
      //check for blocked door
      if (!keyRequired || keyLocked[keyRequired]) {
        return failCommand(
          payload,
          blockedExitData[currentRoom].lockedText,
          "Blocked exit"
        );
      }
    }
  }

  return payload;
};
