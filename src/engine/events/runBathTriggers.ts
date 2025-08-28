import { produce } from "immer";
import { type ItemId } from "../../assets/data/itemData";
import { createKeyGuard } from "../../utils/guards";
import type { PipelineFunction } from "../actions/dispatchCommand";
import type { GameState } from "../gameEngine";
import { stopWithSuccess } from "../utils/abortWithCommandSuccess";
import { failCommand } from "../utils/abortWithCommandFailure";

export const initialBathState = {
  cube: false,
  tetrahedron: false,
  icosahedron: false,
  octahedron: false,
  dodecahedron: false,
} as const satisfies Partial<Record<ItemId, boolean>>;

//Static data
export const bathFeedback = {
  willFloat: "The bath looks watertight and ready to float...",
  willSink: "The bath won't float as it is not quite watertight...",
  failure: "How are you going to cross the river?",
  noOar:
    "You won't get far without an oar.\n\n(Pirhana fish are said to regard human fingers as a great delicacy.)",
  overLoaded:
    "The bath won't carry that much weight. You must take fewer things with you or you will sink.",
  success: "The bath takes you safely across the river.",
  items: {
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
  },
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

const buildBathDescription = (bathState: BathState) => {
  let bathText =
    (willFloat(bathState) ? bathFeedback.willFloat : bathFeedback.willSink) +
    "\n\n";
  bathItems.forEach((item) => {
    bathText +=
      (bathState[item]
        ? bathFeedback.items[item].filled
        : bathFeedback.items[item].empty) + ".\n\n";
  });
  return bathText;
};

const playerIsOverLoaded = (gameState: GameState) => {
  const inventoryCount = Object.values(gameState.itemLocation).filter(
    (location) => location === "player"
  ).length;
  return inventoryCount > 1;
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
    return stopWithSuccess(payload, buildBathDescription(gameState.bathState));
  },

  use: (payload) => {
    const { gameState, target } = payload;
    const { currentRoom, bathState } = gameState;
    //Using item to fill hole
    if (target && canFillBathHole(target, gameState)) {
      const nextGameState = produce(gameState, (draft) => {
        draft.itemLocation[target] = "pit";
        draft.bathState[target] = true;
        draft.storyLine.push(bathFeedback.items[target].filled);
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
    const crossRiverChecks = [
      {
        check: () => !willFloat(bathState),
        action: () =>
          failCommand(payload, buildBathDescription(bathState), "move"),
      },
      {
        check: () => gameState.itemLocation["oar"] !== "player",
        action: () => failCommand(payload, bathFeedback.noOar, "move"),
      },
      {
        check: () => playerIsOverLoaded(gameState),
        action: () => failCommand(payload, bathFeedback.overLoaded, "move"),
      },
    ];

    for (const { check, action } of crossRiverChecks) {
      if (check()) return action();
    }

    // move across river
    const nextGameState = produce(gameState, (draft) => {
      draft.currentRoom = currentRoom === "riverN" ? "riverS" : "riverN";
      draft.storyLine.push(bathFeedback.success);
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
    if (
      (currentRoom === "riverS" && target === "n") ||
      (currentRoom === "riverN" && target === "s")
    ) {
      return failCommand(payload, bathFeedback.failure, "move");
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
