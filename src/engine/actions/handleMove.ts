import type { HandleCommand } from "./dispatchCommand";
import { roomRegistry } from "../world/roomRegistry";
import {
  directionAliases,
  directionNarratives,
  isDirectionAliasKey,
  isDirectionNarrativeKey,
} from "../constants/directions";

export const handleMove: HandleCommand = ({ keyWord, state }) => {
  const roomId = state.currentRoom;
  if (isDirectionAliasKey(keyWord)) {
    keyWord = directionAliases[keyWord];
    if (roomRegistry.hasExit(roomId, keyWord)) {
      const newRoomId = roomRegistry.getExitDestination(roomId, keyWord);
      if (
        typeof newRoomId !== "undefined" &&
        isDirectionNarrativeKey(keyWord)
      ) {
        const newRoomsVisited = new Set(state.roomsVisited);
        newRoomsVisited.add(newRoomId);
        let newState = {
          ...state,
          currentRoom: newRoomId,
          roomsVisited: newRoomsVisited,
          stepCount: state.stepCount + 1,
          storyLine: [
            ...state.storyLine,
            `you travel ${directionNarratives[keyWord]}`,
            roomRegistry.getLongDescription(newRoomId),
          ],
        };
        return newState;
      }
    }
  }

  let newState = {
    ...state,
    storyLine: [...state.storyLine, `You cannot travel in that direction!`],
  };
  return newState;
};

export const handleNull: HandleCommand = ({ keyWord, state }) => {
  console.log(keyWord);
  return state;
};
