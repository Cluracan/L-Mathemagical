import type { ExitDirection } from "../../assets/data/RoomTypes";

// userInput -> ExitDirection
export const directionAliases: Record<string, ExitDirection> = {
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

// type guard
export function isDirectionAliasKey(
  key: string
): key is keyof typeof directionAliases {
  return key in directionAliases;
}

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

// type guard
export function isDirectionNarrativeKey(
  key: string
): key is keyof typeof directionNarratives {
  return key in directionNarratives;
}

/* Use:

if(isDirectionKey(keyWord)){

..then  directions[keyWord]  is safely an ExitDirection

}

*/
