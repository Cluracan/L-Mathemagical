import { produce } from "immer";

import type { PipelineFunction } from "../../pipeline/types";

const dialog = [
  "The abbot says he would like to find Runia but he is an old man and needs your help. She is somewhere in the palace. He warns you that there are many dangers, such as the Drogo Robot Guards, who are impossible to defeat unless you can find the personal secret number which each guard cannot bear to hear. You will come up against many weird and puzzling situations before you can find Runia.\n\nThe abbot asks you again if you will help.",
  "A strange sound behind you attracts your attention. When you turn back the abbot has vanished",
];

export const handleAbbotPuzzle: PipelineFunction = (payload) => {
  const { command, target, gameState } = payload;
  const { puzzleState } = gameState;
  switch (command) {
    case "say":
      if (target && ["y", "yes"].includes(target)) {
        if (puzzleState.abbot.dialogIndex === dialog.length - 1) {
          const nextGameState = produce(gameState, (draft) => {
            draft.puzzleCompleted.abbot = true;
            draft.storyLine.push(dialog[puzzleState.abbot.dialogIndex]);
          });
          return { ...payload, gameState: nextGameState };
        } else {
          const nextGameState = produce(gameState, (draft) => {
            draft.storyLine.push(dialog[puzzleState.abbot.dialogIndex]);
            draft.puzzleState.abbot.dialogIndex += 1;
          });
          return { ...payload, gameState: nextGameState };
        }
      } else if (target && ["n", "no"].includes(target)) {
        const nextGameState = produce(gameState, (draft) => {
          draft.puzzleCompleted.abbot = true;
          draft.currentPuzzle = null;
          draft.storyLine.push(dialog[dialog.length - 1]);
        });
        return { ...payload, gameState: nextGameState, done: true };
      } else {
        const nextGameState = produce(gameState, (draft) => {
          draft.puzzleCompleted.abbot = true;
          draft.currentPuzzle = null;
          draft.storyLine.push("Hmm? Says the abbot");
        });
        return { ...payload, gameState: nextGameState, done: true };
      }
    case "move":
      const nextGameState = produce(gameState, (draft) => {
        draft.puzzleCompleted.abbot = true;
        draft.currentPuzzle = null;
        draft.storyLine.push(dialog[dialog.length - 1]);
      });
      return { ...payload, gameState: nextGameState };
    case "look":
      if (target === null || target === "abbot") {
        const nextGameState = produce(gameState, (draft) => {
          draft.storyLine.push('"Shall I continue?" asks the abbot');
        });
        return { ...payload, gameState: nextGameState, done: true };
      }
  }
  return payload;
};
