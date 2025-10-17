import { getDrogoDescription } from "../events/runDrogoTriggers";
import { getPuzzleNPCDescription } from "../puzzles/addPuzzleNPC";
import { isItemId } from "../../assets/data/itemData";
import { itemRegistry } from "../world/itemRegistry";
import { roomRegistry } from "../world/roomRegistry";
import type { Command } from "../dispatchCommand";
import type { GameState } from "../gameEngine";

// Helpers
const buildFloorItemDescription = (
  itemLocation: GameState["itemLocation"],
  currentRoom: GameState["currentRoom"]
) => {
  const itemsPresent: string[] = [];
  for (const [item, location] of Object.entries(itemLocation)) {
    if (location === currentRoom && isItemId(item)) {
      itemsPresent.push(itemRegistry.getFloorDescription(item));
    }
  }
  return itemsPresent;
};

export const buildRoomDescription = (
  gameState: GameState,
  command: Command
) => {
  const { visitedRooms, currentRoom, itemLocation, drogoGuard, puzzleState } =
    gameState;

  const roomText =
    visitedRooms.has(currentRoom) && command !== "look"
      ? roomRegistry.getShortDescription(currentRoom)
      : roomRegistry.getLongDescription(currentRoom);
  const itemsPresent = buildFloorItemDescription(itemLocation, currentRoom);
  const drogoText = getDrogoDescription(drogoGuard);
  const puzzleNPCText = getPuzzleNPCDescription(
    visitedRooms,
    currentRoom,
    puzzleState
  );

  return [
    roomText,
    ...itemsPresent,
    ...(drogoText ? [drogoText] : []),
    ...(puzzleNPCText ? [puzzleNPCText] : []),
  ];
};
