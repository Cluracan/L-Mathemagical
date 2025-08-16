import { useGameStore } from "../store/useGameStore";
import { parseInput } from "./parser/parseInput";
import { dispatchCommand } from "./actions/dispatchCommand";
import type { RoomId } from "../assets/data/RoomId";
import type { ItemId } from "./world/itemRegistry";

export type GameState = {
  currentRoom: RoomId;
  itemLocation: Record<ItemId, RoomId>;
  roomsVisited: Set<RoomId>;
  stepCount: number;
  storyLine: string[];
};

class GameEngine {
  constructor() {}
  handleInput(userInput: string) {
    //Take a snapshot of state
    const { currentRoom, itemLocation, roomsVisited, stepCount, storyLine } =
      useGameStore.getState();

    //Send input to storyLine
    const gameState = {
      currentRoom,
      itemLocation,
      roomsVisited,
      stepCount,
      storyLine: [...storyLine, userInput],
    };

    //parse input
    const { command, keyWord } = parseInput(userInput);

    //send to dispatch
    let newState = dispatchCommand({ command, keyWord, gameState });

    //update state
    useGameStore.setState({
      ...gameState,
      currentRoom: newState?.currentRoom,
      roomsVisited: newState?.roomsVisited,
      stepCount: newState?.stepCount,
      storyLine: newState?.storyLine,
    });
  }
}

const gameEngine = new GameEngine();
export const handleInput = gameEngine.handleInput.bind(gameEngine);
