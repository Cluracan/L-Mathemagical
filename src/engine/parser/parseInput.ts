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
  teleport: ["neumann"],
  use: ["use", "insert", "apply"],
};

export const parseInput = (
  userInput: string
): { command: Command | null; keyWord: string | null } => {
  const tokens = userInput.toLowerCase().trim().split(/\s+/);
  const [commandWord, ...args] = tokens;
  //Can just type 'N'
  if (isDirectionAlias(commandWord)) {
    return { command: "move", keyWord: `${directionAliases[commandWord]}` };
  }
  //'rusty key' and 'rusty' must return target: 'rusty'
  let target;
  if (args.length < 1) {
    target = null;
  } else if (isItemId(args[args.length - 1])) {
    target = args[args.length - 1];
  } else if (args.length > 1 && isItemId(args[args.length - 2])) {
    target = args[args.length - 2];
  } else {
    target = args[args.length - 1];
  }
  console.log({ commandWord, target });
  for (const [command, triggerWords] of Object.entries(commandDictionary)) {
    if (triggerWords.includes(commandWord)) {
      return { command, keyWord: target } as {
        command: Command;
        keyWord: string;
      };
    }
  }
  return { command: null, keyWord: target };
};
