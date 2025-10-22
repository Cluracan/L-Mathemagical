import { produce } from "immer";
import type { Command } from "../../dispatchCommand";
import { parseInput } from "../../parser/parseInput";
import {
  initialComputerState,
  MAX_RECURSION,
  type ComputerState,
} from "./computerConstants";
import { createKeyGuard } from "../../../utils/guards";
import { simulateHandleMove } from "./simulateHandleMove";
import { roomRegistry } from "../../world/roomRegistry";
import type { KeyId } from "../../../assets/data/itemData";
import { computerNPC } from "./computerNPC";

// Types
interface ComputerSimulationArgs {
  state: ComputerState;
  userInput: string;
  keyLocked: Record<KeyId, boolean>;
}

export interface CommandArgs {
  command: Command;
  target: string | null;
  computerState: ComputerState;
  keyLocked: Record<KeyId, boolean>;
}

// Narrative Content
const computerFeedback = {
  failureMessage: {
    budge:
      "You don't seem to have the strength to move things in this world...",
    drink: "You don't have anything to drink!",
    drop: "You are not carrying anything!",
    get: "You don't seem able to touch anything in this world...",
    inventory: "You are not carrying anything!",
    look: "It's hard to see clearly. There is a strange ethereal quality to everything...",
    say: "You don't seem able to communicate in this world...",
    swim: "That would not be a good idea...",
    teleport: "Your powers are sadly diminished in this ethereal world!",
    unknown: "I don't understand...try moving around a little.",
    use: "You don't seem able to do that in this world.",
  },
};
const hasFailureMessage = createKeyGuard(computerFeedback.failureMessage);

// Helpers
const dispatchSimulation = (args: CommandArgs) => {
  const commandHandler = commandHandlers[args.command];
  return commandHandler(args);
};

const commandHandlers = {
  budge: handleDeny,
  drink: handleDeny,
  drop: handleDeny,
  get: handleDeny,
  inventory: handleDeny,
  look: simulateHandleLook,
  move: simulateHandleMove,
  say: handleDeny,
  swim: handleDeny,
  teleport: handleDeny,
  use: simulateHandleUse,
  unknown: handleDeny,
};

function handleDeny(args: CommandArgs) {
  const { command, computerState } = args;
  return produce(computerState, (draft) => {
    if (!hasFailureMessage(command)) {
      throw new Error(`Passed command ${command} to handleDeny`);
    }
    const failureMessage = computerFeedback.failureMessage[command];
    const recursionLevel = draft.recursionLevel;
    draft.feedback[recursionLevel].push(failureMessage);
  });
}

function simulateHandleUse(args: CommandArgs) {
  const { computerState, target } = args;
  return produce(computerState, (draft) => {
    const recursionLevel = draft.recursionLevel;
    if (draft.currentLocation !== "computer" || target !== "computer") {
      draft.feedback[recursionLevel].push(computerFeedback.failureMessage.use);
    } else if (recursionLevel < MAX_RECURSION) {
      draft.feedback[recursionLevel].push(computerNPC.feedback.puzzleAccept);
      draft.recursionLevel++;
      draft.currentLocation = initialComputerState.currentLocation;
    } else {
      draft.feedback[recursionLevel].push(
        `The message on the screen reads:-\n\n\t\tERROR: Out of memory at recursion level ${String(recursionLevel + 1)}`
      );
    }
  });
}

function simulateHandleLook(args: CommandArgs) {
  const { computerState, target } = args;
  return produce(computerState, (draft) => {
    const recursionLevel = draft.recursionLevel;
    if (!target) {
      const roomDescription = roomRegistry.getLongDescription(
        draft.currentLocation
      );
      draft.feedback[recursionLevel].push(roomDescription);
    } else {
      draft.feedback[recursionLevel].push(computerFeedback.failureMessage.look);
    }
  });
}

export const computerSimulation = (args: ComputerSimulationArgs) => {
  const { state, userInput, keyLocked } = args;

  // Insert userInput
  const computerState = produce(state, (draft) => {
    const recursionLevel = draft.recursionLevel;
    draft.feedback[recursionLevel].push(userInput);
  });

  // Parse input
  const { command, target } = parseInput(userInput);

  // Send to dispatch
  const newComputerState = dispatchSimulation({
    command,
    target,
    computerState,
    keyLocked,
  });
  return newComputerState;
};
