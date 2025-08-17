import {
  isBlockedRoom,
  blockedExitData,
} from "../../assets/data/blockedExitData";
import type { MovePipelineFunction } from "../actions/handleMove";

export const runMoveTriggers: MovePipelineFunction = (payload) => {
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
        return {
          ...payload,
          gameState: {
            ...payload.gameState,
            storyLine: [
              ...payload.gameState.storyLine,
              blockedExitData[currentRoom].lockedText,
            ],
          },
          aborted: true,
        };
      }
    }
  }

  return payload;
};
