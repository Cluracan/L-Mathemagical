import type { PipelineFunction } from "../actions/dispatchCommand";
import { isItemId, keyList } from "../../assets/data/itemData";

/*
Attempts to interpret 'key' (not an item) where possible
target='key' --> target = 'rusty' | 'iron' 
*/

export const runKeyConversion: PipelineFunction = (payload) => {
  const { command, target, gameState } = payload;
  const { storyLine, itemLocation, currentRoom } = gameState;
  //This is just for when a user types 'key' instead of 'iron'
  if (target === "key") {
    const keyInRoom = keyList.find(
      (keyId) => isItemId(keyId) && itemLocation[keyId] === currentRoom
    );

    const keyOnPlayer = keyList.find(
      (keyId) => isItemId(keyId) && itemLocation[keyId] === "player"
    );
    switch (command) {
      case "get":
        if (keyInRoom && isItemId(keyInRoom)) {
          return {
            ...payload,
            target: keyInRoom,
          };
        }
        break;
      case "drink":
        if (keyOnPlayer) {
          return {
            ...payload,
            gameState: {
              ...gameState,
              storyLine: [
                ...storyLine,
                "Drinking a key seems both difficult and unwise...",
              ],
            },
          };
        }
        break;
      case "drop":
        if (keyOnPlayer && isItemId(keyOnPlayer)) {
          return {
            ...payload,
            target: keyOnPlayer,
          };
        }
        break;
      case "look":
        if (keyOnPlayer && isItemId(keyOnPlayer)) {
          return {
            ...payload,
            target: keyOnPlayer,
          };
        }
        if (keyInRoom && isItemId(keyInRoom)) {
          return {
            ...payload,
            target: keyInRoom,
          };
        }
        break;
      case "use":
        if (keyOnPlayer && isItemId(keyOnPlayer)) {
          return {
            ...payload,
            target: keyOnPlayer,
          };
        }
        break;
      default:
        return payload;
    }
  }
  return payload;
};
