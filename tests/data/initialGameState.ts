import {
  initialItemLocation,
  initialKeyLocked,
} from "../../src/assets/data/itemData";
import { RoomId } from "../../src/assets/data/roomData";
import { initialBathState } from "../../src/engine/events/runBathTriggers";
import { GameState } from "../../src/engine/gameEngine";

export const initialGameState: GameState = {
  currentRoom: "grass",
  itemLocation: initialItemLocation,
  keyLocked: initialKeyLocked,
  playerHeight: "one",
  isInvisible: false,
  stepCount: 0,
  storyLine: [],
  visitedRooms: new Set<RoomId>([]),
  bathState: initialBathState,
  success: true,
  feedback: "",
};
