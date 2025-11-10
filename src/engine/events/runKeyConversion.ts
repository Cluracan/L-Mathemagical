import { produce } from "immer";
import { isItemId, keyList } from "../../assets/data/itemData";
import type { PipelineFunction } from "../pipeline/types";

/*
Attempts to interpret 'key' (which is not an item) where possible
target='key' --> target = 'rusty' | 'iron' 
*/

export const runKeyConversion: PipelineFunction = (payload) => {
  const { command, target, gameState } = payload;
  const { itemLocation, currentRoom } = gameState;

  if (target !== "key") return payload;

  const keyInRoom = keyList.filter(
    (keyId) => itemLocation[keyId] === currentRoom
  );

  const keyOnPlayer = keyList.filter(
    (keyId) => itemLocation[keyId] === "player"
  );

  let availableKeys: string[] = [];

  switch (command) {
    case "get":
      availableKeys = keyInRoom;
      break;
    case "drop":
      availableKeys = keyOnPlayer;
      break;
    case "use":
      availableKeys = keyOnPlayer;
      break;
    case "look":
      availableKeys = keyOnPlayer.length > 0 ? keyOnPlayer : keyInRoom;
      break;
    //other commands are unaffected
    default:
      return payload;
  }
  // Multiple keys
  if (availableKeys.length > 1) {
    const actionVerb = command === "look" ? "look at" : command;
    const inputSuggestions = availableKeys
      .map(
        (key, index) =>
          `${index === availableKeys.length - 1 ? 'or "' : '"'}${command} ${key}"`
      )
      .join(availableKeys.length === 2 ? " " : ", ");
    const feedback = `Which key would you like to ${actionVerb}? Try ${inputSuggestions}.`;
    return produce(payload, (draft) => {
      draft.gameState.storyLine.push({
        type: "warning",
        text: feedback,
        isEncrypted: draft.gameState.encryptionActive,
      });
      draft.done = true;
    });
  }

  // Key was found
  if (availableKeys.length === 1 && isItemId(availableKeys[0])) {
    return { ...payload, target: availableKeys[0] };
  }
  // Else
  return payload;
};
