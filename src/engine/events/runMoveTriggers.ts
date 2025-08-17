import {
  isBlockedRoom,
  blockedExitData,
} from "../../assets/data/blockedExitData";
import type { MovePipelineFunction } from "../actions/handleMove";

export const runMoveTriggers: MovePipelineFunction = (payload) => {
  const { currentRoom, keyLocked } = payload.gameState;
  const keyWord = payload.keyWord;
  //blocked room check
  if (isBlockedRoom(currentRoom) && keyWord) {
    const blockedDirections: string[] = blockedExitData[currentRoom].direction;
    const keyRequired = blockedExitData[currentRoom].keyRequired;
    //check attempting to use blocked exit
    if (blockedDirections.includes(keyWord)) {
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
