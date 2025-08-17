import { roomRegistry } from "../world/roomRegistry";
import { itemRegistry } from "../world/itemRegistry";
import { isItemId } from "../../assets/data/itemData";
import type { GameState } from "../gameEngine";
import type { Command, HandleCommand } from "./dispatchCommand";

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

type LookPayload = {
  command: Command;
  target: string | null;
  gameState: GameState;
  aborted: boolean;
};

type LookPipelineFunction = (args: LookPayload) => LookPayload;

const lookRoom: LookPipelineFunction = (payload) => {
  if (payload.target === null) {
    const roomDescription = buildRoomDescription(payload.gameState);
    return {
      ...payload,
      gameState: {
        ...payload.gameState,
        storyLine: [...payload.gameState.storyLine, ...roomDescription],
      },
      aborted: true,
    };
  }
  return payload;
};

const lookItem: LookPipelineFunction = (payload) => {
  const { gameState, target } = payload;
  const { itemLocation, currentRoom } = gameState;

  //Look at item
  if (target && isItemId(target)) {
    if (itemLocation[target] === "player") {
      return {
        ...payload,
        gameState: {
          ...gameState,
          storyLine: [
            ...gameState.storyLine,
            itemRegistry.getInventoryDescription(target),
          ],
        },
        aborted: true,
      };
    } else if (itemLocation[target] === currentRoom) {
      return {
        ...payload,
        gameState: {
          ...gameState,
          storyLine: [
            ...gameState.storyLine,
            itemRegistry.getFloorDescription(target),
          ],
        },
        aborted: true,
      };
    } else {
      return {
        ...payload,
        gameState: {
          ...gameState,
          storyLine: [...gameState.storyLine, "You don't see that here!"],
        },
        aborted: true,
      };
    }
  }
  return payload;
};

const lookDrogo: LookPipelineFunction = (payload) => {
  return payload;
};

const lookPuzzleNPC: LookPipelineFunction = (payload) => {
  return payload;
};

const lookBath: LookPipelineFunction = (payload) => {
  return payload;
};

const lookPipline = [lookRoom, lookItem, lookDrogo, lookPuzzleNPC, lookBath];

export const handleLook: HandleCommand = ({ target, gameState }) => {
  const payload: LookPayload = {
    gameState,
    command: "look",
    target,
    aborted: false,
  };

  const finalPayload = lookPipline.reduce((curPayload, curFunction) => {
    return curPayload.aborted ? curPayload : curFunction(curPayload);
  }, payload);

  return finalPayload.gameState;
  /*
  
    */
  //Look at room (no target)

  //Look at something in room (RUN ROOMCHECK? SHOULD ALL THESE NOW BE PIPELINES?) <---I think not - just do check for look at puzzleNPC & drogo guard & BATH (these should have examine decriptions on target(arg) as they can then provide clues to stuff)<---which maybne means pipeline as that's 3 things

  //Else you are looking at something I don't know what it is...

  //TODO return below is to be removed
};
