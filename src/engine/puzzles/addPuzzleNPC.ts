import type { GameState } from "../gameEngine";
import { isPuzzleLocation, puzzleRegistry } from "./puzzleRegistry";

export const addPuzzleNPC = (gameState: GameState): string | null => {
  const { visitedRooms, currentRoom, puzzleCompleted } = gameState;
  if (!isPuzzleLocation(currentRoom)) return null;

  const { puzzleId, puzzleNPC } = puzzleRegistry[currentRoom];
  return puzzleCompleted[puzzleId]
    ? puzzleNPC.descriptions.completed
    : visitedRooms.has(currentRoom)
      ? puzzleNPC.descriptions.short
      : puzzleNPC.descriptions.long;
};
