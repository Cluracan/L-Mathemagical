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
import { abortWithCommandFailure } from "../utils/abortWithCommandFailure";
import { produce } from "immer";

const validateDirection: PipelineFunction = (payload) => {
  if (payload.target && isDirectionAlias(payload.target)) {
    return { ...payload, direction: directionAliases[payload.target] };
  } else {
    return abortWithCommandFailure(
      payload,
      "That's not a direction!",
      "not a direction"
    );
  }
};

const validateExit: PipelineFunction = (payload) => {
  if (!payload.direction) {
    return {
      ...payload,
      gameState: {
        ...payload.gameState,
        success: false,
        feedback: "ERROR in validateExit",
      },
      aborted: true,
    };
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
    return abortWithCommandFailure(
      payload,
      "You can't travel that way!",
      "exit not available"
    );
  }
};

const movePlayer: PipelineFunction = (payload) => {
  if (!payload.nextRoom || !payload.direction) {
    return {
      ...payload,
      gameState: {
        ...payload.gameState,
        success: false,
        feedback: "ERROR in movePlayer",
      },
      aborted: true,
    };
  }
  const gameState = payload.gameState;
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
    aborted: true,
  };
};

const applyRoomDescription: PipelineFunction = (payload) => {
  const { gameState, command } = payload;
  const roomDescription = buildRoomDescription(gameState, command);
  const nextGameState = produce(gameState, (draft) => {
    draft.storyLine.push(...roomDescription);
  });

  return { ...payload, gameState: nextGameState, aborted: true };
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
    aborted: false,
    direction: null,
    nextRoom: null,
  };
  const finalPayload = movePipeline.reduce((curPayload, curFunction) => {
    return curPayload.aborted ? curPayload : curFunction(curPayload);
  }, payload);
  return finalPayload.gameState;
};
