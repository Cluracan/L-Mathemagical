import type { ExitDirection } from "../../assets/data/RoomTypes";
import { createKeyGuard } from "../../utils/guards";

type DirectionAliasInput =
  | "N"
  | "NORTH"
  | "E"
  | "EAST"
  | "S"
  | "SOUTH"
  | "W"
  | "WEST"
  | "U"
  | "UP"
  | "D"
  | "DOWN"
  | "NE"
  | "NORTHEAST"
  | "NW"
  | "NORTHWEST"
  | "SE"
  | "SOUTHEAST"
  | "SW"
  | "SOUTHWEST"
  | "IN"
  | "OUT";

// userInput -> ExitDirection
export const directionAliases: Record<DirectionAliasInput, ExitDirection> = {
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
};

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

// type guards
export const isDirectionAliasKey = createKeyGuard(directionAliases);

export const isDirectionNarrativeKey = createKeyGuard(directionNarratives);

/* Use:
if(isDirectionKey(keyWord)){
..then  directions[keyWord]  is safely an ExitDirection
}
*/
