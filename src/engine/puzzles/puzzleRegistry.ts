import type { RoomId } from "../../assets/data/roomData";
import { createKeyGuard } from "../../utils/guards";
import { abbotNPC } from "./abbot/abbotNPC";
import { lightsNPC } from "./lights/lightsNPC";

export const puzzleRegistry = {
  store: { puzzleId: "abbot", puzzleNPC: abbotNPC },
  lights: { puzzleId: "lights", puzzleNPC: lightsNPC },
} as const satisfies Partial<Record<RoomId, any>>;

export const isPuzzleLocation = createKeyGuard(puzzleRegistry);

export const initialPuzzleState = Object.fromEntries(
  Object.values(puzzleRegistry).map((puzzle) => [puzzle.puzzleId, false])
);

export type PuzzleId = keyof typeof initialPuzzleState;
