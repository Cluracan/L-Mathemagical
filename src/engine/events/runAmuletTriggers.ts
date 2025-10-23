import { produce } from "immer";
import type { PipelineFunction } from "../pipeline/types";

// Narrative Content
const amuletFeedback = {
  pickUp: {
    playerInvisible:
      "As you pick up the Amulet, the world seems to flare into blinding light. A rush of power tears through you...and as it fades, you glance down to see your hands visible once more. The Amulet hums softly, as if reminding you that magic tolerates no rival. You must escape the palace, and return it to the Abbot before it overwhelms you.",
    playerVisible:
      "As you pick up the Amulet of Yendor, a wave of shimmering light bursts outward. The air trembles with magic, and you feel the Amulet's power surge through you. You must get this back to the abbot quickly, before it overwhelms you.",
  },
  drop: {
    playerInvisible:
      "The instant the Amulet of Yendor leaves your grasp, the shimering light around you fades, and you sense your form slipping once more into the half world of shadows.",
    playerVisible:
      "As the Amulet of Yendor leaves your grasp, the humming in your ears fades, and the air seems to settle. Without the Amulet's light, you feel strangely diminished.",
  },
};

export const runAmuletTriggers: PipelineFunction = (payload) => {
  const { command, target, gameState } = payload;
  const { itemLocation, currentRoom, isInvisible } = gameState;
  if (target !== "amulet") {
    return payload;
  }
  switch (command) {
    case "get": {
      if (itemLocation.amulet === currentRoom) {
        return produce(payload, (draft) => {
          draft.gameState.storyLine.push(
            isInvisible
              ? amuletFeedback.pickUp.playerInvisible
              : amuletFeedback.pickUp.playerVisible
          );
          draft.gameState.itemLocation.amulet = "player";
          draft.gameState.hasAmulet = true;
          draft.done = true;
        });
      }
      break;
    }
    case "drop": {
      if (itemLocation.amulet === "player") {
        return produce(payload, (draft) => {
          draft.gameState.storyLine.push(
            isInvisible
              ? amuletFeedback.drop.playerInvisible
              : amuletFeedback.drop.playerVisible
          );
          draft.gameState.itemLocation.amulet = currentRoom;
          draft.gameState.hasAmulet = false;
          draft.done = true;
        });
      }
    }
  }
  return payload;
};
