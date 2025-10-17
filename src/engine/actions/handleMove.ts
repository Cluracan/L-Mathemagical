import { produce, enableMapSet } from "immer";
import {
  directionAliases,
  directionNarratives,
  isDirectionAlias,
} from "../constants/directions";

import { failCommand } from "../pipeline/failCommand";
import { roomRegistry } from "../world/roomRegistry";
import { runBlockedTriggers } from "../events/runBlockedTriggers";
import { runPoolTriggers } from "../events/runPoolTriggers";
import { runBathTriggers } from "../events/runBathTriggers";

import type { HandleCommand } from "../dispatchCommand";
import type { PipelineFunction, PipelinePayload } from "../pipeline/types";
import { withPipeline } from "../pipeline/withPipeline";
import { runPuzzleTriggers } from "../puzzles/runPuzzleTriggers";
import { runDrogoTriggers } from "../events/runDrogoTriggers";
import { runAtticTriggers } from "../events/runAtticTriggers";
import { buildRoomDescription } from "../utils/buildRoomDescription";

enableMapSet();

//Helper functions
const isValidDirection = (target: string | null) => {
  return !!target && isDirectionAlias(target);
};

//Pipeline functions
const validateDirection: PipelineFunction = (payload) => {
  return isValidDirection(payload.target)
    ? { ...payload, direction: directionAliases[payload.target] }
    : failCommand(payload, "That's not a direction!");
};

const validateExit: PipelineFunction = (payload) => {
  if (!payload.direction) {
    throw new Error("validateExit called without direction");
  }
  const nextRoom = roomRegistry.getExitDestination(
    payload.gameState.currentRoom,
    payload.direction
  );
  return nextRoom
    ? {
        ...payload,
        nextRoom,
      }
    : failCommand(payload, "You can't travel that way!");
};

const movePlayer: PipelineFunction = (payload) => {
  return produce(payload, (draft) => {
    if (draft.nextRoom && draft.direction) {
      draft.gameState.visitedRooms.add(draft.gameState.currentRoom);
      draft.gameState.currentRoom = draft.nextRoom;
      draft.gameState.stepCount++;
      draft.gameState.storyLine.push(
        `You travel ${directionNarratives[draft.direction]}`
      );
      draft.nextRoom = null;
      draft.direction = null;
    }
  });
};

const applyRoomDescription: PipelineFunction = (payload) => {
  const { gameState, command } = payload;
  const roomDescription = buildRoomDescription(gameState, command);
  const nextGameState = produce(gameState, (draft) => {
    draft.storyLine.push(...roomDescription);
  });

  return { ...payload, gameState: nextGameState, done: true };
};

const movePipeline = [
  runPuzzleTriggers,
  validateDirection,
  validateExit,
  runBathTriggers,
  runPoolTriggers,
  runAtticTriggers,
  runBlockedTriggers,
  runDrogoTriggers,
  movePlayer,
  applyRoomDescription,
];

export const handleMove: HandleCommand = (args) => {
  const { command, target, gameState } = args;
  const payload: PipelinePayload = {
    gameState,
    command,
    target,
    done: false,
    direction: null,
    nextRoom: null,
  };

  return withPipeline(payload, movePipeline);
};
