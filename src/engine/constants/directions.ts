import type { ExitDirection } from "../../assets/data/RoomTypes";
import { createKeyGuard } from "../../utils/guards";

// userInput -> ExitDirection
export const directionAliases = {
  N: "N",
  NORTH: "N",
  E: "E",
  EAST: "E",
  S: "S",
  SOUTH: "S",
  W: "W",
  WEST: "W",
  U: "U",
  UP: "U",
  D: "D",
  DOWN: "D",
  NE: "NE",
  NORTHEAST: "NE",
  NW: "NW",
  NORTHWEST: "NW",
  SE: "SE",
  SOUTHEAST: "SE",
  SW: "SW",
  SOUTHWEST: "SW",
  IN: "IN",
  OUT: "OUT",
} as const satisfies Record<string, ExitDirection>;

export type DirectionAliasInput = keyof typeof directionAliases;

// ExitDirection -> storyLine text
export const directionNarratives: Record<ExitDirection, string> = {
  N: "north",
  E: "east",
  S: "south",
  W: "west",
  U: "up",
  D: "down",
  NE: "north-east",
  NW: "north-west",
  SE: "south-east",
  SW: "south-west",
  IN: "inwards",
  OUT: "out",
};

// TODO type guards - if only one, remove utils function?
export const isDirectionAliasKey = createKeyGuard(directionAliases);

// export const isDirectionNarrativeKey = createKeyGuard(directionNarratives);

/* Use:
if(isDirectionKey(keyWord)){
..then  directions[keyWord]  is safely an ExitDirection
}
*/
