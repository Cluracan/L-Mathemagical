import { useGameStore, type GameStoreState } from "../store/useGameStore";
import { parseInput } from "./parser/parseInput";
import { dispatchCommand } from "./actions/dispatchCommand";
import type { RoomId } from "../assets/data/roomData";

export type GameState = Omit<
  GameStoreState,
  "playerName" | "modernMode" | "visitedRooms"
> & {
  visitedRooms: Set<RoomId>;
  success: boolean;
  feedback: string;
};

/** Engine-facing state, derived from GameStoreState.
 *  - visitedRooms stored as a Set for fast membership checks
 *  - adds transient fields: success + feedback
 *  - excludes UI-only fields (playerName, modernMode) */
const toEngineState = (state: GameStoreState, userInput: string): GameState => {
  const { playerName, modernMode, ...rest } = state;
  return {
    ...rest,
    storyLine: [...state.storyLine, userInput],
    visitedRooms: new Set(state.visitedRooms),
    success: true,
    feedback: "",
  };
};

/** Convert engine state back to a form the React store can handle.
 * Strips transient engine fields and converts Sets back to arrays. */
const toStoreState = (state: GameState): Partial<GameStoreState> => {
  const { success, feedback, ...rest } = state;
  return {
    ...rest,
    visitedRooms: Array.from(state.visitedRooms),
  };
};

class GameEngine {
  constructor() {}
  handleInput(userInput: string) {
    //Take a snapshot of state
    const snapshot = toEngineState(useGameStore.getState(), userInput);

    //parse input
    const { command, target } = parseInput(userInput);

    //send to dispatch
    let newState = dispatchCommand({ command, target, gameState: snapshot });
    console.log(newState);
    //update state
    useGameStore.setState(toStoreState(newState));
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
