import { roomRegistry } from "../world/roomRegistry";
import { itemRegistry, type ItemId } from "../world/itemRegistry";
import type { GameState } from "../gameEngine";

export const buildRoomDescription = (gameState: GameState) => {
  const roomDescription = [];
  //Add room text
  roomDescription.push(
    gameState.roomsVisited.has(gameState.currentRoom)
      ? roomRegistry.getShortDescription(gameState.currentRoom)
      : roomRegistry.getLongDescription(gameState.currentRoom)
  );
  //Add items
  const itemDescriptions = [];
  for (const [item, location] of Object.entries(gameState.itemLocation)) {
    if (location === gameState.currentRoom) {
      itemDescriptions.push(itemRegistry.getFloorDescription(item as ItemId));
    }
  }
  if (itemDescriptions.length > 0) {
    roomDescription.push(...itemDescriptions);
  }
  //Add drogoGuard

  //add puzzleNPC
  return roomDescription;
};
