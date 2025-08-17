import { roomRegistry } from "../world/roomRegistry";
import { itemRegistry } from "../world/itemRegistry";
import type { GameState } from "../gameEngine";
import { isItemId } from "../../assets/data/itemData";
import type { HandleCommand } from "./dispatchCommand";
export const buildRoomDescription = (gameState: GameState) => {
  const { roomsVisited, currentRoom, itemLocation } = gameState;
  const roomDescription = [];
  //Add room text
  roomDescription.push(
    roomsVisited.has(currentRoom)
      ? roomRegistry.getShortDescription(currentRoom)
      : roomRegistry.getLongDescription(currentRoom)
  );

  //Add items
  const itemsPresent = [];
  for (const [item, location] of Object.entries(itemLocation)) {
    if (location === currentRoom && isItemId(item)) {
      itemsPresent.push(itemRegistry.getFloorDescription(item));
    }
  }
  roomDescription.push(...itemsPresent);

  //Add drogoGuard

  //add puzzleNPC
  return roomDescription;
};

export const handleLook: HandleCommand = ({ keyWord, gameState }) => {
  console.log(`handleLook, keyword ${keyWord}`);
  const { itemLocation, currentRoom } = gameState;
  console.log({ itemLocation, currentRoom });
  //Look at item
  if (keyWord && isItemId(keyWord)) {
    if (itemLocation[keyWord] === "player") {
      return {
        ...gameState,
        storyLine: [
          ...gameState.storyLine,
          itemRegistry.getInventoryDescription(keyWord),
        ],
      };
    } else if (itemLocation[keyWord] === currentRoom) {
      console.log("on the floor");
      return {
        ...gameState,
        storyLine: [
          ...gameState.storyLine,
          itemRegistry.getFloorDescription(keyWord),
        ],
      };
    } else {
      return {
        ...gameState,
        storyLine: [...gameState.storyLine, "You don't see that here!"],
      };
    }
  }
  //Look at room (no keyword)

  //Look at something in room (RUN ROOMCHECK? SHOULD ALL THESE NOW BE PIPELINES?)

  //Else you are looking at something I don't know what it is...

  //TODO return below is to be removed
  return gameState;
};
