import { produce, enableMapSet } from "immer";
import {
  directionAliases,
  directionNarratives,
  isDirectionAlias,
} from "../constants/directions";
import { buildRoomDescription } from "./handleLook";
import { failCommand } from "../pipeline/failCommand";
import { roomRegistry } from "../world/roomRegistry";
import { runBlockedTriggers } from "../events/runBlockedTriggers";
import { runPoolTriggers } from "../events/runPoolTriggers";
import { runBathTriggers } from "../events/runBathTriggers";

import type { HandleCommand } from "../dispatchCommand";
import type { PipelineFunction, PipelinePayload } from "../pipeline/types";
import { withPipeline } from "../pipeline/withPipeline";
import { runPuzzleTriggers } from "../puzzles/runPuzzleTriggers";

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
  const gameState = payload.gameState;
  if (!!payload.nextRoom && payload.direction) {
    const nextGameState = produce(gameState, (draft) => {
      draft.visitedRooms.add(gameState.currentRoom);
      draft.currentRoom = payload.nextRoom!;
      draft.stepCount = gameState.stepCount + 1;
      draft.storyLine.push(
        `You travel ${directionNarratives[payload.direction!]}`
      );
    });
    return {
      ...payload,
      gameState: nextGameState,
      nextRoom: null,
      direction: null,
      done: false,
    };
  }
  throw new Error("Unexpected code path in movePlayer");
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
  runBlockedTriggers,
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
