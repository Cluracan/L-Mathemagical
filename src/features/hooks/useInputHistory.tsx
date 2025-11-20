import { useRef } from "react";

export const useInputHistory = () => {
  const history = useRef<string[]>([]);
  const pointer = useRef<number>(0);
  const addToHistory = (input: string) => {
    if (history.current[history.current.length - 1] === input) {
      return;
    }
    history.current.push(input);
    pointer.current = history.current.length;
  };

  const getPreviousInput = () => {
    pointer.current = Math.max(0, pointer.current - 1);
    return history.current[pointer.current] ?? "";
  };

  const getNextInput = () => {
    pointer.current = Math.min(pointer.current + 1, history.current.length);
    return history.current[pointer.current] ?? "";
  };

  return { addToHistory, getPreviousInput, getNextInput };
};
