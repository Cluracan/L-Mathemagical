import type { ExitDirection } from "../../assets/data/RoomTypes";

export type Command =
  | "BUDGE"
  | "DRINK"
  | "DROP"
  | "GET"
  | "INVENTORY"
  | "LOOK"
  | "MOVE"
  | "SAY"
  | "SWIM"
  | "TELEPORT"
  | "USE";

const commandDictionary = {
  BUDGE: ["MOVE", "PUSH", "PULL"],
  DRINK: ["DRINK", "QUAFF", "SWIG", "SIP"],
  DROP: ["DROP", "THROW"],
  GET: ["GET", "PICK", "GRAB", "TAKE"],
  INVENTORY: ["INV", "INVENTORY"],
  LOOK: ["LOOK", "SEARCH", "EXAMINE", "READ"],
  MOVE: ["GO", "WALK", "RUN"],
  SAY: ["SAY", "SHOUT", "YELL", "SCREAM"],
  SWIM: ["SWIM", "DIVE"],
  TELEPORT: ["NEUMANN"],
  USE: ["USE", "INSERT", "APPLY"],
};

const directions: Record<string, ExitDirection> = {
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
  NORTHEWST: "NW",
  SE: "SE",
  SOUTHEAST: "SE",
  SW: "SW",
  SOUTHWEST: "SW",
  IN: "IN",
  OUT: "OUT",
};

export const parseInput = (userInput: string) => {
  const splitInput = userInput.toUpperCase().trim().split(" ");
  const commandWord = splitInput[0].trim();
  const keyWord = splitInput[splitInput.length - 1].trim();

  //Can just type 'N'
  if (Object.keys(directions).includes(commandWord)) {
    return { command: "MOVE", arg: `${directions[commandWord]}` };
  }
  for (const [command, triggerWords] of Object.entries(commandDictionary)) {
    if (triggerWords.includes(commandWord)) {
      return { command, keyWord };
    }
  }
  return { command: null, keyWord };
};
