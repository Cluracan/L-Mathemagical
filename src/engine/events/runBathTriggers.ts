import { produce } from "immer";
import { createKeyGuard } from "../../utils/guards";
import { stopWithSuccess } from "../pipeline/stopWithSuccess";
import { failCommand } from "../pipeline/failCommand";
import type { PipelineFunction } from "../pipeline/types";
import type { GameState } from "../gameEngine";
import type { ItemId } from "../../assets/data/itemData";

// Initial State
export const initialBathState = {
  cube: false,
  tetrahedron: false,
  icosahedron: false,
  octahedron: false,
  dodecahedron: false,
} as const satisfies Partial<Record<ItemId, boolean>>;

// Narrative Content
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

//Helpers
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

//Main Function
export const runBathTriggers: PipelineFunction = (payload) => {
  const { command, target, gameState } = payload;
  switch (command) {
    case "look": {
      if (
        target !== "bath" ||
        (gameState.currentRoom !== "riverS" &&
          gameState.currentRoom !== "riverN")
      ) {
        return payload;
      }
      return stopWithSuccess(
        payload,
        buildBathDescription(gameState.bathState)
      );
    }
    case "use": {
      const { currentRoom, bathState } = gameState;
      //Use item to fill hole
      if (target && canFillBathHole(target, gameState)) {
        return produce(payload, (draft) => {
          draft.gameState.itemLocation[target] = "pit";
          draft.gameState.bathState[target] = true;
          draft.gameState.storyLine.push(bathFeedback.items[target].filled);
          draft.done = true;
        });
      }

      if (target !== "bath") {
        return payload;
      }
      //Use bath to cross river
      const crossRiverChecks = [
        {
          check: () => !willFloat(bathState),
          action: () => failCommand(payload, buildBathDescription(bathState)),
        },
        {
          check: () => gameState.itemLocation.oar !== "player",
          action: () => failCommand(payload, bathFeedback.noOar),
        },
        {
          check: () => playerIsOverLoaded(gameState),
          action: () => failCommand(payload, bathFeedback.overLoaded),
        },
      ];
      for (const { check, action } of crossRiverChecks) {
        if (check()) return action();
      }
      // Else move across river
      return produce(payload, (draft) => {
        draft.gameState.currentRoom =
          currentRoom === "riverN" ? "riverS" : "riverN";
        draft.gameState.storyLine.push(bathFeedback.success);
        draft.done = true;
      });
    }
    case "move": {
      if (
        (gameState.currentRoom === "riverS" && target === "n") ||
        (gameState.currentRoom === "riverN" && target === "s")
      ) {
        return failCommand(payload, bathFeedback.failure);
      } else {
        return payload;
      }
    }
    default:
      return payload;
  }
};
