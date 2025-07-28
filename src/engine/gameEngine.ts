import { useGameStore } from "../store/useGameStore";
import { parseInput } from "./parser/parseInput";
import { dispatchCommand } from "./actions/dispatchCommand";
import type { RoomId } from "../assets/data/RoomId";

export type GameState = {
  currentRoom: RoomId;
  roomsVisited: Set<RoomId>;
  stepCount: number;
  storyLine: string[];
};

class GameEngine {
  constructor() {}
  handleInput(userInput: string) {
    const { currentRoom, roomsVisited, stepCount, storyLine } =
      useGameStore.getState();
    const state = { currentRoom, roomsVisited, stepCount, storyLine };
    const { command, keyWord } = parseInput(userInput);

    let newState = dispatchCommand({ command, keyWord, state });
    useGameStore.setState({
      ...state,
      currentRoom: newState?.currentRoom,
      roomsVisited: newState?.roomsVisited,
      stepCount: newState?.stepCount,
      storyLine: newState?.storyLine,
    });
  }
}

export const gameEngine = new GameEngine();
gameEngine.handleInput("go north");
gameEngine.handleInput("go north");
