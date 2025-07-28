import { useGameStore } from "../store/useGameStore";
import { parseInput } from "./parser/parseInput";

class GameEngine {
  constructor() {}
  handleInput(userInput: string) {
    const { command, keyWord } = parseInput(userInput);
    if (command === null) {
      // send I don't understand to the storyline (or pick from a variety)
    } else {
      //get copy of state
      //let newState = this.processTurn(this.dispatchCommand({action, keyWord, state}))  (or denest these for clarity)
      //update state
    }
  }
}

export const gameEngine = new GameEngine();
