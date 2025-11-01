import type { HandleCommand } from "../dispatchCommand";
import type { PipelineFunction, PipelinePayload } from "../pipeline/types";
import {
  directionAliases,
  directionNarratives,
  isDirectionAlias,
} from "../constants/directions";
import {
  buildRoomDescription,
  toRoomDescriptionArgs,
} from "../utils/buildRoomDescription";
import { produce, enableMapSet } from "immer";
import { failCommand } from "../pipeline/failCommand";
import { roomRegistry } from "../world/roomRegistry";
import { runBlockedTriggers } from "../events/runBlockedTriggers";
import { runPoolTriggers } from "../events/runPoolTriggers";
import { runBathTriggers } from "../events/runBathTriggers";
import { withPipeline } from "../pipeline/withPipeline";
import { runPuzzleTriggers } from "../puzzles/runPuzzleTriggers";
import { runDrogoTriggers } from "../events/runDrogoTriggers";
import { runAtticTriggers } from "../events/runAtticTriggers";
import { runGuardRoomTriggers } from "../events/runGuardRoomTriggers";
import { assertIsDefined } from "../utils/assertIsDefined";
import { runCellRoomTriggers } from "../events/runCellRoomTriggers";
import { createStoryElements } from "../utils/createStoryElements";
import { runSpectacletriggers } from "../events/runSpectacleTrrggers";

enableMapSet();

const isValidDirection = (target: string | null) => {
  return !!target && isDirectionAlias(target);
};

const validateDirection: PipelineFunction = (payload) => {
  if (!isValidDirection(payload.target)) {
    return failCommand({
      payload,
      type: "warning",
      text: "That's not a direction!",
    });
  }

  const direction = directionAliases[payload.target];
  return { ...payload, direction };
};

const validateExit: PipelineFunction = (payload) => {
  assertIsDefined(payload.direction);
  const nextRoom = roomRegistry.getExitDestination(
    payload.gameState.currentRoom,
    payload.direction
  );
  if (!nextRoom) {
    return failCommand({
      payload,
      type: "warning",
      text: "You can't travel that way!",
    });
  }
  return {
    ...payload,
    nextRoom,
  };
};

const movePlayer: PipelineFunction = (payload) => {
  return produce(payload, (draft) => {
    assertIsDefined(draft.nextRoom);
    assertIsDefined(draft.direction);
    draft.gameState.visitedRooms.add(draft.gameState.currentRoom);
    draft.gameState.currentRoom = draft.nextRoom;
    draft.gameState.stepCount++;
    draft.gameState.storyLine.push({
      type: "action",
      text: `You travel ${directionNarratives[draft.direction]}`,
      isEncrypted: draft.gameState.encryptionActive,
    });
    draft.nextRoom = null;
    draft.direction = null;
  });
};

const applyRoomDescription: PipelineFunction = (payload) => {
  return produce(payload, (draft) => {
    const args = toRoomDescriptionArgs(draft.gameState);
    const roomDescription = buildRoomDescription(args, "move");
    draft.gameState.storyLine.push(
      ...createStoryElements({
        type: "description",
        text: roomDescription,
        isEncrypted: draft.gameState.encryptionActive,
      })
    );
    draft.done = true;
  });
};

const movePipeline = [
  runPuzzleTriggers,
  validateDirection,
  validateExit,
  runBathTriggers,
  runPoolTriggers,
  runAtticTriggers,
  runGuardRoomTriggers,
  runCellRoomTriggers,
  runBlockedTriggers,
  runDrogoTriggers,
  movePlayer,
  runSpectacletriggers,
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
