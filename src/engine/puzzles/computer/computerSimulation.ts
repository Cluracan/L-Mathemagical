import { produce } from "immer";
import { useGameStore } from "../../../store/useGameStore";
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
type ComputerSimulation = (
  userInput: string,
  keyLocked: Record<KeyId, boolean>
) => ComputerState;

export interface SimulationArgs {
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
    say: "You don't seem able to communicate in this world...",
    swim: "That would not be a good idea...",
    teleport: "Your powers are sadly diminished in this ethereal world!",
    unknown: "I don't understand...try moving around a little.",
  },
};
const hasFailureMessage = createKeyGuard(computerFeedback.failureMessage);

// Helpers
const dispatchSimulation = (args: SimulationArgs) => {
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

function handleDeny(args: SimulationArgs) {
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

function simulateHandleUse(args: SimulationArgs) {
  const { computerState, target } = args;
  return produce(computerState, (draft) => {
    const recursionLevel = draft.recursionLevel;
    if (draft.currentLocation !== "computer" || target !== "computer") {
      draft.feedback[recursionLevel].push(
        "You don't seem able to do that in this world."
      );
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

function simulateHandleLook(args: SimulationArgs) {
  const { computerState, target } = args;
  return produce(computerState, (draft) => {
    const recursionLevel = draft.recursionLevel;
    if (!target) {
      const roomDescription = roomRegistry.getLongDescription(
        draft.currentLocation
      );
      draft.feedback[recursionLevel].push(roomDescription);
    } else {
      draft.feedback[recursionLevel].push(
        "It's hard to see clearly. There is a strange ethereal quality to everything..."
      );
    }
  });
}

export const computerSimulation: ComputerSimulation = (
  userInput,
  keyLocked
) => {
  // Take a snapshot of state
  const initialComputerState = useGameStore.getState().puzzleState.computer;

  // Insert userInput
  const computerState = produce(initialComputerState, (draft) => {
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
