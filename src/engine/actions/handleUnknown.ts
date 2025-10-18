import { produce } from "immer";
import type { HandleCommand } from "../dispatchCommand";

const unknownFeedback = [
  "I don't understand...",
  "That doesn't make sense, I'm afraid...",
  "Try using two word commands, like 'go north', or 'get cube'",
  "Hmm?",
  "I don't follow you",
  "I can't do that...",
];

export const handleUnknown: HandleCommand = (args) => {
  const { gameState } = args;
  return produce(gameState, (draft) => {
    const rngIndex = Math.floor(Math.random() * unknownFeedback.length);
    draft.storyLine.push(unknownFeedback[rngIndex]);
  });
};
