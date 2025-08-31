import { abbotNPC } from "./abbot/abbotNPC";
import { handleAbbotPuzzle } from "./abbot/handleAbbotPuzzle";
import { lightsNPC } from "./lights/lightsNPC";
import { LightsPuzzle } from "./lights/LightsPuzzle";
import { createKeyGuard } from "../../utils/guards";
import type { PuzzleNPC } from "./types";
import type { PipelineFunction } from "../pipeline/types";
import type { RoomId } from "../../assets/data/roomData";

export const puzzleRegistry = {
  store: {
    puzzleId: "abbot",
    puzzleNPC: abbotNPC,
    pipelineFunction: handleAbbotPuzzle,
    component: null,
  },
  lights: {
    puzzleId: "lights",
    puzzleNPC: lightsNPC,
    pipelineFunction: null,
    component: LightsPuzzle,
  },
} as const satisfies Partial<
  Record<
    RoomId,
    {
      puzzleId: string;
      puzzleNPC: PuzzleNPC;
      pipelineFunction: PipelineFunction | null;
      component: React.FunctionComponent | null;
    }
  >
>;

export type PuzzleId =
  (typeof puzzleRegistry)[keyof typeof puzzleRegistry]["puzzleId"];

export const isPuzzleLocation = createKeyGuard(puzzleRegistry);

export const initialPuzzleState = Object.fromEntries(
  Object.values(puzzleRegistry).map((puzzle) => [puzzle.puzzleId, false])
) as Record<PuzzleId, boolean>;
