import { directionAliases, isDirectionAlias } from "../constants/directions";
import type { Command } from "../actions/dispatchCommand";

const commandDictionary: Record<Command, string[]> = {
  budge: ["move", "push", "pull"],
  drink: ["drink", "quaff", "swig", "sip"],
  drop: ["drop", "throw"],
  get: ["get", "pick", "grab", "take"],
  inventory: ["inv", "inventory"],
  look: ["look", "search", "examine", "read"],
  move: ["go", "walk", "run"],
  say: ["say", "shout", "yell", "scream"],
  swim: ["swim", "dive"],
  teleport: ["neumann"],
  use: ["use", "insert", "apply"],
};

export const parseInput = (
  userInput: string
): { command: Command | null; keyWord: string | null } => {
  const splitInput = userInput.toLowerCase().trim().split(" ");
  const commandWord = splitInput[0].trim();
  const keyWord =
    splitInput.length > 1 ? splitInput[splitInput.length - 1].trim() : null;

  //Can just type 'N'
  if (isDirectionAlias(commandWord)) {
    return { command: "move", keyWord: `${directionAliases[commandWord]}` };
  }
  for (const [command, triggerWords] of Object.entries(commandDictionary)) {
    if (triggerWords.includes(commandWord)) {
      return { command, keyWord } as { command: Command; keyWord: string };
    }
  }
  return { command: null, keyWord };
};
