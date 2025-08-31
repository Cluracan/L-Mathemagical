import { useRef } from "react";
import { useGameStore } from "../store/useGameStore";
import { handleInput } from "../engine/gameEngine";

export const useGameController = () => {
  const readyForInputRef = useRef<boolean>(true);
  const inputQueueRef = useRef<string[]>([]);
  const { modernMode } = useGameStore();

  const submitInput = (userInput: string) => {
    inputQueueRef.current.push(userInput);

    processInputQueue();
  };

  const processInputQueue = () => {
    while (readyForInputRef.current && inputQueueRef.current.length > 0) {
      const userInput = inputQueueRef.current.shift();
      if (userInput) {
        readyForInputRef.current = false;
        const result = handleInput(userInput);

        //Only map animation is async
        if (
          (result.command !== "move" && result.feedback !== "move") || //non-move
          !result.success || //failed-move
          !modernMode //no map
        ) {
          readyForInputRef.current = true;
        }
      }
    }
  };

  const reportAnimationComplete = () => {
    readyForInputRef.current = true;

    processInputQueue();
  };

  return { submitInput, reportAnimationComplete };
};
