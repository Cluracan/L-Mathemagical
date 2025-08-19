import { useGameStore, type GameStoreState } from "../store/useGameStore";
import { parseInput } from "./parser/parseInput";
import { dispatchCommand } from "./actions/dispatchCommand";
import type { RoomId } from "../assets/data/roomData";

export type GameState = Omit<
  GameStoreState,
  "playerName" | "modernMode" | "visitedRooms"
> & { visitedRooms: Set<RoomId> };

class GameEngine {
  constructor() {}
  handleInput(userInput: string) {
    //Take a snapshot of state
    const {
      currentRoom,
      itemLocation,
      isInvisible,
      keyLocked,
      visitedRooms,
      stepCount,
      storyLine,
    } = useGameStore.getState();

    //Send input to storyLine
    const gameState = {
      currentRoom,
      itemLocation,
      isInvisible,
      keyLocked,
      visitedRooms: new Set(visitedRooms),
      stepCount,
      storyLine: [...storyLine, userInput.trim()],
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
      visitedRooms: Array.from(newState.visitedRooms.values()),
      stepCount: newState.stepCount,
      storyLine: newState.storyLine,
    });
  }
}

const gameEngine = new GameEngine();
export const handleInput = gameEngine.handleInput.bind(gameEngine);
