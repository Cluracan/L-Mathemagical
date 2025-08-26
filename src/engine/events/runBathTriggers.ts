import { type ItemId } from "../../assets/data/itemData";
import { createKeyGuard } from "../../utils/guards";
import type { PipelineFunction } from "../actions/dispatchCommand";
import type { GameState } from "../gameEngine";

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
    empty: "...it has a trianglular hole",
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

const bathResponse = {
  willFloat: "looks watertight and ready to float...\n\n",
  willSink: "won't float as it is not quite watertight...\n\n",
  failure: "How are you going to cross the river?",
  noOar:
    "You won't get far without an oar.\n\n(Pirhana fish are said to regard human fingers as a great delicacy.)",
  overLoaded:
    "The bath won't carry that much weight. You must take fewer things with you or you will sink.",
  success: "The bath takes you safely across the river.",
};

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

//Main function
export const runBathTriggers: PipelineFunction = (payload) => {
  const { command, target, gameState } = payload;
  const { itemLocation, currentRoom, bathState, storyLine } = gameState;

  if (currentRoom !== "riverS" && currentRoom !== "riverN") return payload;

  //Look at bath
  if (command === "look" && target === "bath") {
    return {
      ...payload,
      gameState: {
        ...gameState,
        storyLine: [...storyLine, getBathDescription(bathState)],
      },
      aborted: true,
    };
  }
  //Use Bath/move across river
  if (
    (command === "use" && target === "bath") ||
    (command === "move" && currentRoom === "riverS" && target === "n") ||
    (command === "move" && currentRoom === "riverN" && target === "s")
  ) {
    if (!willFloat(bathState)) {
      return {
        ...payload,
        gameState: {
          ...gameState,
          storyLine: [...storyLine, getBathDescription(bathState)],
          success: false,
          feedback: "move",
        },
        aborted: true,
      };
    }
    if (noOar(gameState)) {
      return {
        ...payload,
        gameState: {
          ...gameState,
          storyLine: [...storyLine, bathResponse.noOar],
          success: false,
          feedback: "move",
        },
        aborted: true,
      };
    }
    if (playerIsOverLoaded(gameState)) {
      return {
        ...payload,
        gameState: {
          ...gameState,
          storyLine: [...storyLine, bathResponse.overLoaded],
          success: false,
          feedback: "move",
        },
        aborted: true,
      };
    }

    return {
      ...payload,
      gameState: {
        ...gameState,
        storyLine: [...storyLine, bathResponse.success],
        currentRoom: currentRoom === "riverN" ? "riverS" : "riverN",
        feedback: "move",
      },
      aborted: true,
    };
  }

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

  //Use item to fill hole
  if (command === "use" && canFillBathHole(target, gameState)) {
    bathState[target] = true;
    itemLocation[target] = "pit";
    return {
      ...payload,
      gameState: {
        ...gameState,
        storyLine: [...storyLine, bathItemDescription[target].filled],
      },
      aborted: true,
    };
  }

  return payload;
};
