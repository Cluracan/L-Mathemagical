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

const validateDirection: PipelineFunction = (payload) => {
  if (payload.target && isDirectionAlias(payload.target)) {
    return { ...payload, direction: directionAliases[payload.target] };
  } else {
    return {
      ...payload,
      gameState: {
        ...payload.gameState,
        storyLine: [...payload.gameState.storyLine, "That's not a direction!"],
        success: false,
        feedback: "not a direction",
      },
      aborted: true,
    };
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
    return {
      ...payload,
      gameState: {
        ...payload.gameState,
        storyLine: [
          ...payload.gameState.storyLine,
          "You can't travel that way!",
        ],
        success: false,
        feedback: "exit not available",
      },
      aborted: true,
    };
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

  return {
    ...payload,
    gameState: {
      ...payload.gameState,
      nextRoom: null,
      visitedRooms: new Set(payload.gameState.visitedRooms).add(
        payload.gameState.currentRoom
      ),
      currentRoom: payload.nextRoom,
      stepCount: payload.gameState.stepCount + 1,
      storyLine: [
        ...payload.gameState.storyLine,
        `You travel ${directionNarratives[payload.direction]}`,
      ],
    },
  };
};

const applyRoomDescription: PipelineFunction = (payload) => {
  const roomDescription = buildRoomDescription({
    gameState: payload.gameState,
    command: payload.command,
  });
  return {
    ...payload,
    gameState: {
      ...payload.gameState,
      storyLine: [...payload.gameState.storyLine, ...roomDescription],
    },
  };
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
