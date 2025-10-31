import { useGameStore, type GameStoreState } from "../store/useGameStore";
import { parseInput } from "./parser/parseInput";
import { dispatchCommand } from "./dispatchCommand";
import type { RoomId } from "../assets/data/roomData";

export type GameState = Omit<
  GameStoreState,
  "playerName" | "modernMode" | "visitedRooms"
> & {
  visitedRooms: Set<RoomId>;
};

const toEngineState = (state: GameStoreState): GameState => {
  // assign playerName & modernMode to define 'rest'
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { playerName, modernMode, ...rest } = state;
  return {
    ...rest,
    visitedRooms: new Set(state.visitedRooms),
  };
};

const toStoreState = (state: GameState): Partial<GameStoreState> => {
  return {
    ...state,
    visitedRooms: Array.from(state.visitedRooms),
  };
};

const gameEngine = {
  handleInput: (userInput: string) => {
    // Take a snapshot of state
    const snapshot = toEngineState(useGameStore.getState());

    // Insert userInput into feedback
    snapshot.storyLine = [
      ...snapshot.storyLine,
      {
        type: "input",
        text: userInput,
        isEncrypted: snapshot.encryptionActive,
      },
    ];

    // Parse input
    const { command, target } = parseInput(userInput);

    // Send to dispatch
    const newState = dispatchCommand({ command, target, gameState: snapshot });

    // Location check (for UI map animation)
    const locationChanged = snapshot.currentRoom !== newState.currentRoom;

    // Update state
    useGameStore.setState(toStoreState(newState));
    return {
      locationChanged,
    };
  },
};

export const handleInput = gameEngine.handleInput;
