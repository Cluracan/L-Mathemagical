import type { ExitDirection } from "../../assets/data/roomData";
import { createKeyGuard } from "../../utils/guards";

// userInput -> ExitDirection
export const directionAliases = {
  n: "n",
  north: "n",
  e: "e",
  east: "e",
  s: "s",
  south: "s",
  w: "w",
  west: "w",
  u: "u",
  up: "u",
  d: "d",
  down: "d",
  ne: "ne",
  northeast: "ne",
  nw: "nw",
  northwest: "nw",
  se: "se",
  southeast: "se",
  sw: "sw",
  southwest: "sw",
  in: "in",
  out: "out",
} as const satisfies Record<string, ExitDirection>;

export type DirectionAliasInput = keyof typeof directionAliases;

// ExitDirection -> storyLine text
export const directionNarratives: Record<ExitDirection, string> = {
  n: "north",
  e: "east",
  s: "south",
  w: "west",
  u: "up",
  d: "down",
  ne: "north-east",
  nw: "north-west",
  se: "south-east",
  sw: "south-west",
  in: "inwards",
  out: "out",
};

// TODO type guards - if only one, remove utils function?
export const isDirectionAliasKey = createKeyGuard(directionAliases);

// export const isDirectionNarrativeKey = createKeyGuard(directionNarratives);

/* Use:
if(isDirectionKey(keyWord)){
..then  directions[keyWord]  is safely an ExitDirection
}
*/
