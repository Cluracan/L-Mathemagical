import type { Command } from "../dispatchCommand";
import type { GameState } from "../gameEngine";
import { getDrogoDescription } from "../events/runDrogoTriggers";
import { getPuzzleNPCDescription } from "../puzzles/addPuzzleNPC";
import { isItemId } from "../../assets/data/itemData";
import { itemRegistry } from "../world/itemRegistry";
import { roomRegistry } from "../world/roomRegistry";

// Types
interface RoomDescriptionArgs {
  visitedRooms: GameState["visitedRooms"];
  currentRoom: GameState["currentRoom"];
  itemLocation: GameState["itemLocation"];
  drogoGuard: GameState["drogoGuard"];
  puzzleState: GameState["puzzleState"];
}

// Helpers
export const toRoomDescriptionArgs = (state: GameState) => {
  return {
    visitedRooms: state.visitedRooms,
    currentRoom: state.currentRoom,
    itemLocation: state.itemLocation,
    drogoGuard: state.drogoGuard,
    puzzleState: state.puzzleState,
  };
};

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
  args: RoomDescriptionArgs,
  command: Command
) => {
  const { visitedRooms, currentRoom, itemLocation, drogoGuard, puzzleState } =
    args;

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
