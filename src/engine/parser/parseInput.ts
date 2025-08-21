import { directionAliases, isDirectionAlias } from "../constants/directions";
import type { Command } from "../actions/dispatchCommand";
import { isItemId } from "../../assets/data/itemData";

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
  teleport: ["teleport"],
  use: ["use", "insert", "apply"],
};

type ParseInput = (args: string) => {
  command: Command | null;
  target: string | null;
};

export const parseInput: ParseInput = (userInput) => {
  const [commandWord, ...args] = userInput.toLowerCase().trim().split(/\s+/);

  //Can just type 'N'
  if (isDirectionAlias(commandWord)) {
    return { command: "move", target: `${directionAliases[commandWord]}` };
  }
  //'rusty key' and 'rusty' must return target: 'rusty' (coerce last two words to an item if possible)
  let target = args[args.length - 1];

  for (const [command, triggerWords] of Object.entries(commandDictionary)) {
    if (triggerWords.includes(commandWord)) {
      return { command, target } as {
        command: Command;
        target: string;
      };
    }
  }
  return { command: null, target };
};
