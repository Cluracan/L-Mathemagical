import { abbotHallwayNPC, abbotKitchenNPC, abbotNPC } from "./abbot/abbotNPC";
import { handleAbbotPuzzle } from "./abbot/handleAbbotPuzzle";
import { lightsNPC } from "./lights/lightsNPC";
import { LightsPuzzle } from "./lights/LightsPuzzle";
import { createKeyGuard } from "../../utils/guards";
import type { PuzzleNPC } from "./types";
import type { PipelineFunction } from "../pipeline/types";
import type { RoomId } from "../../assets/data/roomData";
import { fileNPC } from "./file/fileNPC";
import { FilePuzzle } from "./file/FilePuzzle";

export const puzzleAtLocation = {
  store: {
    puzzleId: "abbot",
    puzzleNPC: abbotNPC,
  },

  hallway: {
    puzzleId: "abbot",
    puzzleNPC: abbotHallwayNPC,
  },
  kitchen: {
    puzzleId: "abbot",
    puzzleNPC: abbotKitchenNPC,
  },
  lights: {
    puzzleId: "lights",
    puzzleNPC: lightsNPC,
  },
  file: {
    puzzleId: "file",
    puzzleNPC: fileNPC,
  },
} as const satisfies Partial<
  Record<
    RoomId,
    {
      puzzleId: string;
      puzzleNPC: PuzzleNPC;
    }
  >
>;

export const puzzleRegistry = {
  abbot: {
    pipelineFunction: handleAbbotPuzzle,
    component: null,
  },
  lights: {
    pipelineFunction: null,
    component: LightsPuzzle,
  },
  file: {
    pipelineFunction: null,
    component: FilePuzzle,
  },
} as const satisfies Partial<
  Record<
    string,
    {
      pipelineFunction: PipelineFunction | null;
      component: React.FunctionComponent<{ visible: boolean }> | null;
    }
  >
>;

export type PuzzleId = keyof typeof puzzleRegistry;

export const isPuzzleLocation = createKeyGuard(puzzleAtLocation);

export const initialPuzzleCompletedState = Object.fromEntries(
  Object.keys(puzzleRegistry).map((puzzle) => [puzzle, false])
) as Record<PuzzleId, boolean>;
