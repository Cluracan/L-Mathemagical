import { produce } from "immer";
import type { HandleCommand } from "../dispatchCommand";
import type { PipelineFunction, PipelinePayload } from "../pipeline/types";
import { withPipeline } from "../pipeline/withPipeline";
import { runPuzzleTriggers } from "../puzzles/runPuzzleTriggers";
import { runDrogoTriggers } from "../events/runDrogoTriggers";
import { runAtticTriggers } from "../events/runAtticTriggers";
import { runGuardRoomTriggers } from "../events/runGuardRoomTriggers";

// Narrative Content
const sayFeedback = {
  saySomething: [
    "Your words have no effect.",
    "You cast your thoughts out into the room...",
    "You speak out loud, but noone appears to notice.",
  ],
  sayNothing: "Say what?",
};

const sayTarget: PipelineFunction = (payload) => {
  const rngIndex = Math.floor(Math.random() * sayFeedback.saySomething.length);
  return produce(payload, (draft) => {
    draft.gameState.storyLine.push(
      payload.target
        ? sayFeedback.saySomething[rngIndex]
        : sayFeedback.sayNothing
    );
  });
};

const sayPipeline: PipelineFunction[] = [
  runPuzzleTriggers,
  runAtticTriggers,
  runDrogoTriggers,
  runGuardRoomTriggers,
  sayTarget,
];

export const handleSay: HandleCommand = (args) => {
  const { command, target, gameState } = args;
  const payload: PipelinePayload = {
    command,
    gameState,
    target,
    done: false,
  };

  return withPipeline(payload, sayPipeline);
};
