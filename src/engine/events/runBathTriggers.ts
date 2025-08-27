import { produce } from "immer";
import { type ItemId } from "../../assets/data/itemData";
import { createKeyGuard } from "../../utils/guards";
import type { PipelineFunction } from "../actions/dispatchCommand";
import type { GameState } from "../gameEngine";
import { stopWithSuccess } from "../utils/abortWithCommandSuccess";
import { failCommand } from "../utils/abortWithCommandFailure";
import type { RoomId } from "../../assets/data/roomData";

//Static data
export const initialBathState = {
  cube: false,
  tetrahedron: false,
  icosahedron: false,
  octahedron: false,
  dodecahedron: false,
} as const satisfies Partial<Record<ItemId, boolean>>;

const bathItemDescription = {
  tetrahedron: {
    filled: "The platinum tetrahedron neatly fits the triangular hole",
    empty: "...it has a triangular hole",
  },
  cube: {
    filled: "The gold cube fills the rectangular hole",
    empty: "...it has a rectangular hole",
  },
  icosahedron: {
    filled: "The jade icosahedron has plugged the large hole with five sides",
    empty: "...it has a large hole with five sides",
  },
  octahedron: {
    filled: "The ivory octahedron has filled the square hole",
    empty: "...it has a square hole",
  },
  dodecahedron: {
    filled:
      "The diamond dodecahedron fits snugly into the small hole with five sides",
    empty: "...it has a small hole with five sides",
  },
};

export const bathResponse = {
  willFloat: "looks watertight and ready to float...\n\n",
  willSink: "won't float as it is not quite watertight...\n\n",
  failure: "How are you going to cross the river?",
  noOar:
    "You won't get far without an oar.\n\n(Pirhana fish are said to regard human fingers as a great delicacy.)",
  overLoaded:
    "The bath won't carry that much weight. You must take fewer things with you or you will sink.",
  success: "The bath takes you safely across the river.",
} as const;

const bathItems = Object.keys(
  initialBathState
) as (keyof typeof initialBathState)[];

//Types
export type BathState = Record<keyof typeof initialBathState, boolean>;

//Helper functions
const isBathItem = createKeyGuard(initialBathState);
const willFloat = (bath: BathState) =>
  Object.values(bath).every((holeFilled) => holeFilled);

const getBathDescription = (bathState: BathState) => {
  let bathText = "The bath ";
  bathText += willFloat(bathState)
    ? bathResponse.willFloat
    : bathResponse.willSink;
  bathItems.forEach((item) => {
    if (bathState[item]) {
      bathText += `${bathItemDescription[item].filled}\n\n`;
    } else {
      bathText += `${bathItemDescription[item].empty}\n\n`;
    }
  });
  return bathText;
};

const noOar = (gameState: GameState) => {
  return gameState.itemLocation["oar"] !== "player";
};

const playerIsOverLoaded = (gameState: GameState) => {
  const inventoryCount = Object.values(gameState.itemLocation).reduce(
    (acc, cur) => {
      return cur === "player" ? acc + 1 : acc;
    },
    0
  );
  return inventoryCount > 1;
};

const playerIsAttemptingToCrossRiver = (
  currentRoom: RoomId,
  target: string | null
) => {
  return (
    (currentRoom === "riverS" && target === "n") ||
    (currentRoom === "riverN" && target === "s")
  );
};

const canFillBathHole = (
  target: string | null,
  gameState: GameState
): target is keyof typeof initialBathState => {
  return (
    !!target &&
    isBathItem(target) &&
    gameState.itemLocation[target] === "player"
  );
};

//command handlers
const bathCommandHandlers = {
  look: (payload) => {
    const { gameState, target } = payload;
    if (
      target !== "bath" ||
      (gameState.currentRoom !== "riverS" && gameState.currentRoom !== "riverN")
    ) {
      return payload;
    }

    return stopWithSuccess(payload, getBathDescription(gameState.bathState));
  },

  use: (payload) => {
    const { gameState, target } = payload;
    const { currentRoom, bathState } = gameState;
    //Using item to fill hole
    if (target && canFillBathHole(target, gameState)) {
      const nextGameState = produce(gameState, (draft) => {
        draft.itemLocation[target] = "pit";
        draft.bathState[target] = true;
        draft.storyLine.push(bathItemDescription[target].filled);
      });
      return {
        ...payload,
        gameState: nextGameState,
        done: true,
      };
    }

    if (target !== "bath") {
      return payload;
    }
    //Using bath to cross river
    if (!willFloat(bathState)) {
      return failCommand(payload, getBathDescription(bathState), "move");
    }

    if (noOar(gameState))
      return failCommand(payload, bathResponse.noOar, "move");

    if (playerIsOverLoaded(gameState)) {
      return failCommand(payload, bathResponse.overLoaded, "move");
    }
    // move across river
    const nextGameState = produce(gameState, (draft) => {
      draft.currentRoom = currentRoom === "riverN" ? "riverS" : "riverN";
      draft.storyLine.push(bathResponse.success);
      draft.feedback = "move";
    });
    return {
      ...payload,
      gameState: nextGameState,
      done: true,
    };
  },

  move: (payload) => {
    const { gameState, target } = payload;
    const { currentRoom } = gameState;
    if (playerIsAttemptingToCrossRiver(currentRoom, target)) {
      return failCommand(payload, bathResponse.failure, "move");
    } else {
      return payload;
    }
  },
} as const satisfies Record<string, PipelineFunction>;
const isBathCommand = createKeyGuard(bathCommandHandlers);

//Main function
export const runBathTriggers: PipelineFunction = (payload) => {
  const { command } = payload;
  if (isBathCommand(command)) {
    return bathCommandHandlers[command](payload);
  } else {
    return payload;
  }
};
