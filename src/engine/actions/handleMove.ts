import { buildRoomDescription } from "./handleLook";
import { roomRegistry } from "../world/roomRegistry";
import { runMoveTriggers } from "../events/runMoveTriggers";
import {
  directionAliases,
  directionNarratives,
  isDirectionAlias,
} from "../constants/directions";

import type { Command, HandleCommand } from "./dispatchCommand";
import type { GameState } from "../gameEngine";
import type { RoomId, ExitDirection } from "../../assets/data/roomData";

type MovePayload = {
  command: Command;
  target: string | null;
  gameState: GameState;
  direction: ExitDirection | null;
  nextRoom: RoomId | null;
  aborted: boolean;
};

export type MovePipelineFunction = (args: MovePayload) => MovePayload;

const validateDirection: MovePipelineFunction = (payload) => {
  if (payload.target && isDirectionAlias(payload.target)) {
    return { ...payload, direction: directionAliases[payload.target] };
  } else {
    return {
      ...payload,
      gameState: {
        ...payload.gameState,
        storyLine: [...payload.gameState.storyLine, "That's not a direction!"],
      },
      aborted: true,
    };
  }
};

const validateExit: MovePipelineFunction = (payload) => {
  if (!payload.direction) {
    console.log("error in validateExit - no direction");
    return { ...payload, aborted: true };
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
      },
      aborted: true,
    };
  }
};

const movePlayer: MovePipelineFunction = (payload) => {
  if (!payload.nextRoom || !payload.direction) {
    console.log(
      `Error in movePlayer: nextRoom is ${payload.nextRoom}, direction is ${payload.direction}`
    );
    return { ...payload, aborted: true };
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

const applyRoomDescription: MovePipelineFunction = (payload) => {
  const roomDescription = buildRoomDescription({
    gameState: payload.gameState,
    command: "move",
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
  validateDirection,
  validateExit,
  runMoveTriggers,
  movePlayer,
  applyRoomDescription,
];

export const handleMove: HandleCommand = ({ target, gameState }) => {
  const payload: MovePayload = {
    gameState,
    command: "move",
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
