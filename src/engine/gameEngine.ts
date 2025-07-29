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
    console.log({ command, keyWord });
    let newState = dispatchCommand({ command, keyWord, state });
    console.log(newState);
    useGameStore.setState({
      ...state,
      currentRoom: newState?.currentRoom,
      roomsVisited: newState?.roomsVisited,
      stepCount: newState?.stepCount,
      storyLine: newState?.storyLine,
    });
  }
}

const gameEngine = new GameEngine();
export const handleInput = gameEngine.handleInput.bind(gameEngine);
