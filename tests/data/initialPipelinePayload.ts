import {
  initialItemLocation,
  initialKeyLocked,
} from "../../src/assets/data/itemData";
import { initialBathState } from "../../src/engine/events/runBathTriggers";

import type { RoomId } from "../../src/assets/data/roomData";
import type { PipelinePayload } from "../../src/engine/pipeline/types";

export const initialPipelinePayload: PipelinePayload = {
  command: "look",
  target: "bath",
  gameState: {
    bathState: initialBathState,
    currentRoom: "grass",
    isInvisible: false,
    itemLocation: initialItemLocation,
    keyLocked: initialKeyLocked,
    playerHeight: "one",
    stepCount: 0,
    storyLine: [],
    visitedRooms: new Set<RoomId>(["grass"]),
    success: true,
    feedback: "",
  },
  done: false,
};
