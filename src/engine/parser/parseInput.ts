import { directionAliases, isDirectionAliasKey } from "../constants/directions";
import type { Command } from "../actions/dispatchCommand";

const commandDictionary: Record<Command, string[]> = {
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

export const parseInput = (
  userInput: string
): { command: Command | null; keyWord: string } => {
  const splitInput = userInput.toUpperCase().trim().split(" ");
  const commandWord = splitInput[0].trim();
  const keyWord = splitInput[splitInput.length - 1].trim();

  //Can just type 'N'
  if (isDirectionAliasKey(commandWord)) {
    return { command: "MOVE", keyWord: `${directionAliases[commandWord]}` };
  }
  for (const [command, triggerWords] of Object.entries(commandDictionary)) {
    if (triggerWords.includes(commandWord)) {
      return { command, keyWord } as { command: Command; keyWord: string };
    }
  }
  return { command: null, keyWord };
};
