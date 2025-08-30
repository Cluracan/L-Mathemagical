import { produce } from "immer";
import type { GameState } from "../gameEngine";

type NullCommandArgs = {
  command: null;
  target: string | null;
  gameState: GameState;
};

type HandleNullCommand = (args: NullCommandArgs) => GameState;

const nullFeedback = [
  "I don't understand...",
  "That doesn't make sense, I'm afraid...",
  "Try using two word commands, like 'go north', or 'get cube'",
  "Hmm?",
  "I don't follow you",
  "I can't do that...",
];

export const handleNull: HandleNullCommand = (args) => {
  const { gameState } = args;
  const rngIndex = Math.floor(Math.random() * (nullFeedback.length - 1));
  const nextGameState = produce(gameState, (draft) => {
    draft.storyLine.push(nullFeedback[rngIndex]);
    draft.success = false;
    draft.feedback = "handleNull";
  });

  return args.gameState;
};
