import { buildRoomDescription } from "./handleLook";
import { roomRegistry } from "../world/roomRegistry";
import { runBlockedTriggers } from "../events/runBlockedTriggers";
import { runPoolTriggers } from "../events/runPoolTriggers";
import {
  directionAliases,
  directionNarratives,
  isDirectionAlias,
} from "../constants/directions";

import type {
  CommandPayload,
  HandleCommand,
  PipelineFunction,
} from "./dispatchCommand";
import { runBathTriggers } from "../events/runBathTriggers";

import { produce, enableMapSet } from "immer";
import { failCommand } from "../utils/abortWithCommandFailure";

enableMapSet();

const validateDirection: PipelineFunction = (payload) => {
  if (payload.target && isDirectionAlias(payload.target)) {
    return { ...payload, direction: directionAliases[payload.target] };
  } else {
    return failCommand(payload, "That's not a direction!", "not a direction");
  }
};

const validateExit: PipelineFunction = (payload) => {
  if (!payload.direction) {
    throw new Error("validateExit called without direction");
  }
  const nextRoom = roomRegistry.getExitDestination(
    payload.gameState.currentRoom,
    payload.direction
  );
  if (nextRoom) {
    return {
      ...payload,
      nextRoom,
    };
  } else {
    return failCommand(
      payload,
      "You can't travel that way!",
      "exit not available"
    );
  }
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
  runBathTriggers,
  runPoolTriggers,
  validateDirection,
  validateExit,
  runBlockedTriggers,
  movePlayer,
  applyRoomDescription,
];

export const handleMove: HandleCommand = (args) => {
  const { command, target, gameState } = args;
  const payload: CommandPayload = {
    gameState,
    command,
    target,
    done: false,
    direction: null,
    nextRoom: null,
  };
  const finalPayload = movePipeline.reduce((curPayload, curFunction) => {
    return curPayload.done ? curPayload : curFunction(curPayload);
  }, payload);
  return finalPayload.gameState;
};
