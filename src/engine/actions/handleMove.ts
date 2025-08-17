import { roomRegistry } from "../world/roomRegistry";
import {
  directionAliases,
  directionNarratives,
  isDirectionAliasKey,
} from "../constants/directions";

import type { Command, HandleCommand } from "./dispatchCommand";
import type { GameState } from "../gameEngine";
import type { RoomId, ExitDirection } from "../../assets/data/roomData";
import { buildRoomDescription } from "./handleLook";

type Payload = {
  aborted: boolean;
  keyWord: string | null;
  gameState: GameState;
  command?: Command;
  direction?: ExitDirection;
  nextRoom?: RoomId;
};

type PipelineFunction = (args: Payload) => Payload;

const validateDirection: PipelineFunction = (payload) => {
  if (payload.keyWord && isDirectionAliasKey(payload.keyWord)) {
    return { ...payload, direction: directionAliases[payload.keyWord] };
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

const validateExit: PipelineFunction = (payload) => {
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

const movePlayer: PipelineFunction = (payload) => {
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
      roomsVisited: new Set(payload.gameState.roomsVisited).add(
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
  const roomDescription = buildRoomDescription(payload.gameState);
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
  movePlayer,
  applyRoomDescription,
];

export const handleMove: HandleCommand = ({ keyWord, gameState }) => {
  const payload: Payload = {
    gameState,
    command: "MOVE",
    keyWord,
    aborted: false,
  };
  const finalPayload = movePipeline.reduce((curPayload, curFunction) => {
    return curPayload.aborted ? curPayload : curFunction(curPayload);
  }, payload);
  return finalPayload.gameState;
};

export const handleNull: HandleCommand = ({ keyWord, gameState }) => {
  console.log(keyWord);
  return gameState;
};
