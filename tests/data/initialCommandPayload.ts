import {
  initialItemLocation,
  initialKeyLocked,
} from "../../src/assets/data/itemData";
import type { RoomId } from "../../src/assets/data/roomData";
import type { CommandPayload } from "../../src/engine/actions/dispatchCommand";
import { initialBathState } from "../../src/engine/events/runBathTriggers";

export const initialCommandPayload: CommandPayload = {
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
  aborted: false,
};
