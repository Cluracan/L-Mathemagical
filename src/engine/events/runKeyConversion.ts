import { isItemId, keyList } from "../../assets/data/itemData";
import type { PipelineFunction } from "../pipeline/types";

/*
Attempts to interpret 'key' (which is not an item) where possible
target='key' --> target = 'rusty' | 'iron' 
*/

export const runKeyConversion: PipelineFunction = (payload) => {
  const { command, target, gameState } = payload;
  const { itemLocation, currentRoom } = gameState;
  //This is just for when a user types 'key' instead of 'iron'

  if (target !== "key") return payload;

  const keyInRoom = keyList.find(
    (keyId) => itemLocation[keyId] === currentRoom
  );

  const keyOnPlayer = keyList.find((keyId) => itemLocation[keyId] === "player");

  let convertedTarget: string | undefined = undefined;

  switch (command) {
    case "get":
      convertedTarget = keyInRoom;
      break;
    case "drop":
      convertedTarget = keyOnPlayer;
      break;
    case "use":
      convertedTarget = keyOnPlayer;
      break;
    case "look":
      convertedTarget = keyOnPlayer || keyInRoom;
      break;
    //other commands are unaffected
    default:
      return payload;
  }
  //Key was found
  if (convertedTarget && isItemId(convertedTarget)) {
    return { ...payload, target: convertedTarget };
  }
  //Else
  return payload;
};
