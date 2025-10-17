import type { GameState } from "../gameEngine";
import { isPuzzleLocation, puzzleAtLocation } from "./puzzleRegistry";

export const getPuzzleNPCDescription = (
  visitedRooms: GameState["visitedRooms"],
  currentRoom: GameState["currentRoom"],
  puzzleState: GameState["puzzleState"]
) => {
  if (!isPuzzleLocation(currentRoom)) return null;

  const { puzzleId, puzzleNPC } = puzzleAtLocation[currentRoom];
  return puzzleState[puzzleId].puzzleCompleted
    ? puzzleNPC.description.completed
    : visitedRooms.has(currentRoom)
      ? puzzleNPC.description.short
      : puzzleNPC.description.long;
};
