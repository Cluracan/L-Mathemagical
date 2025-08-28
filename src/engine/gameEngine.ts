import { useGameStore, type GameStoreState } from "../store/useGameStore";
import { parseInput } from "./parser/parseInput";
import { dispatchCommand } from "./actions/dispatchCommand";
import type { RoomId } from "../assets/data/roomData";

export type GameState = Omit<
  GameStoreState,
  "playerName" | "modernMode" | "visitedRooms" | "readyForCommand"
> & {
  visitedRooms: Set<RoomId>;
  success: boolean;
  feedback: string;
};

class GameEngine {
  constructor() {}
  handleInput(userInput: string) {
    //Take a snapshot of state
    const {
      currentRoom,
      itemLocation,
      isInvisible,
      keyLocked,
      playerHeight,
      stepCount,
      storyLine,
      visitedRooms,
      bathState,
    } = useGameStore.getState();

    //Send input to storyLine
    const gameState: GameState = {
      currentRoom,
      itemLocation,
      isInvisible,
      keyLocked,
      playerHeight,
      stepCount,
      storyLine: [...storyLine, userInput.trim()],
      visitedRooms: new Set(visitedRooms),
      bathState,
      success: true,
      feedback: "",
    };

    //parse input
    const { command, target } = parseInput(userInput);

    //send to dispatch
    let newState = dispatchCommand({ command, target, gameState });

    //update state
    useGameStore.setState({
      ...gameState,
      currentRoom: newState.currentRoom,
      itemLocation: newState.itemLocation,
      isInvisible: newState.isInvisible,
      keyLocked: newState.keyLocked,
      playerHeight: newState.playerHeight,
      stepCount: newState.stepCount,
      storyLine: newState.storyLine,
      visitedRooms: Array.from(newState.visitedRooms.values()),
      bathState: newState.bathState,
    });
    return {
      success: newState.success,
      feedback: newState.feedback,
      command,
      target,
    };
  }
}

const gameEngine = new GameEngine();
export const handleInput = gameEngine.handleInput.bind(gameEngine);
