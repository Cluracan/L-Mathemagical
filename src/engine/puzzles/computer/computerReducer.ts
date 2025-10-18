import { produce } from "immer";
import { parseInput } from "../../parser/parseInput";
import type { ComputerState } from "./computerConstants";
import {
  directionAliases,
  directionNarratives,
  isDirectionAlias,
} from "../../constants/directions";
import { roomRegistry } from "../../world/roomRegistry";

// Types
type ComputerAction =
  | { type: "submit"; userInput: string; recursionLevel: number }
  | { type: "reset" };

// Narrative Content
const computerFeedback = {
  failureMessage: {
    budge:
      "You don't seem to have the strength to move things in this world...",
    drink: "You don't have anything to drink!",
    drop: "You are not carrying anything!",
    get: "You don't seem able to touch anything in this world...",
    inventory: "You are not carrying anything!",
    say: "You don't seem able to communicate in this world...",
    swim: "That would not be a good idea...",
    teleport: "Your powers are sadly diminished in this ethereal world!",
    unknown: "I don't understand...try moving around a little.",
  },
};

export function computerReducer(state: ComputerState, action: ComputerAction) {
  switch (action.type) {
    case "submit": {
      console.log(action.recursionLevel);
      const { command, target } = parseInput(action.userInput);
      return produce(state, (draft) => {
        draft.feedback[0].push(action.userInput);
        switch (command) {
          case "move": {
            if (!target || !isDirectionAlias(target)) {
              draft.feedback[0].push("That's not a direction!");
            } else {
              const direction = directionAliases[target];
              const nextRoom = roomRegistry.getExitDestination(
                draft.currentLocation,
                direction
              );
              if (!nextRoom) {
                draft.feedback[0].push("You can't travel that way!");
              } else {
                draft.feedback[0].push(
                  `You travel ${directionNarratives[direction]}`
                );
                draft.currentLocation = nextRoom;
                draft.feedback[0].push(
                  roomRegistry.getLongDescription(nextRoom)
                );
              }
            }
            break;
          }
          case "look": {
            //
          }
          case "use": {
            //
            break;
          }
          default: {
            draft.feedback[0].push(computerFeedback.failureMessage[command]);
          }
        }
      });
    }
  }
  return state;
}
