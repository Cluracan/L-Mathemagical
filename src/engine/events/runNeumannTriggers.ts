import { produce } from "immer";
import type { RoomId } from "../../assets/data/roomData";
import type { PipelineFunction } from "../pipeline/types";
import {
  buildRoomDescription,
  toRoomDescriptionArgs,
} from "../utils/buildRoomDescription";
import { createStoryElements } from "../utils/createStoryElements";

// Config
const VALID_ROOMS: RoomId[] = ["atticPassage"];

// Narrative Content
const travelText =
  "Suddenly it goes dark. You experience the sensation of travelling in a high speed lift.";
const mannersText =
  "That is excellent manners, but you get the feeling that this is not the magic word you are looking for.";

export const runNeumannTriggers: PipelineFunction = (payload) => {
  const { command, target, gameState } = payload;
  // Early return
  if (!VALID_ROOMS.includes(gameState.currentRoom)) {
    return payload;
  }

  if (command === "say" && target === "neumann") {
    return produce(payload, (draft) => {
      draft.gameState.storyLine.push({
        type: "action",
        text: travelText,
        isEncrypted: draft.gameState.encryptionActive,
      });
      draft.gameState.currentRoom = "cupboard";
      const args = toRoomDescriptionArgs(draft.gameState);
      const roomDescription = buildRoomDescription(args, "move");
      draft.gameState.storyLine.push(
        ...createStoryElements({
          type: "description",
          text: roomDescription,
          isEncrypted: draft.gameState.encryptionActive,
        }),
      );
      draft.gameState.drogoGuard = null; //defensive since drogo not allowed in valid rooms
      draft.done = true;
    });
  }
  if (command === "say" && target === "please") {
    return produce(payload, (draft) => {
      draft.gameState.storyLine.push({
        type: "action",
        text: mannersText,
        isEncrypted: draft.gameState.encryptionActive,
      });
      draft.done = true;
    });
  }

  return payload;
};
