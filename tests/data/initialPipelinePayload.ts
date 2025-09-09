import {
  initialItemLocation,
  initialKeyLocked,
} from "../../src/assets/data/itemData";
import { initialBathState } from "../../src/engine/events/runBathTriggers";

import type { RoomId } from "../../src/assets/data/roomData";
import type { PipelinePayload } from "../../src/engine/pipeline/types";
import { initialPuzzleCompletedState } from "../../src/engine/puzzles/puzzleRegistry";
import { initialKeySelectedCells } from "../../src/engine/puzzles/key/KeyPuzzle";
import {
  initialLightsFeedback,
  initialLightsOrder,
} from "../../src/engine/puzzles/lights/LightsPuzzle";
import {
  initialTreeFeedback,
  initialTreeSelectedCells,
} from "../../src/engine/puzzles/tree/TreePuzzle";
import { initialTurtleDisplacement } from "../../src/engine/puzzles/turtle/handleTurtlePuzzle";

export const initialPipelinePayload: PipelinePayload = {
  command: "look",
  target: "bath",
  gameState: {
    currentRoom: "grass",
    visitedRooms: new Set<RoomId>(["grass"]),
    storyLine: [],
    stepCount: 0,
    itemLocation: initialItemLocation,
    keyLocked: initialKeyLocked,
    playerHeight: "one",
    isInvisible: false,
    bathState: initialBathState,
    drogoGuard: null,
    puzzleCompleted: initialPuzzleCompletedState,
    currentPuzzle: null,
    puzzleState: {
      abbot: { dialogIndex: 0 },
      key: { selectedCells: initialKeySelectedCells },
      lights: {
        curOrder: initialLightsOrder,
        feedback: initialLightsFeedback,
        turns: 0,
        switchesActive: true,
      },
      tree: {
        selectedCells: initialTreeSelectedCells,
        feedback: initialTreeFeedback,
      },
      turtle: { displacement: initialTurtleDisplacement },
    },
    showDialog: false,
    feedback: "move",
    success: true,
  },
  done: false,
};
