import type { RoomId } from "../../assets/data/roomData";
import type { PipelineFunction } from "../pipeline/types";

//Drogo feww rooms = puzzleNPC locations concatted with [attic, pig, the passage between, and anything else]
const drogoFreeRooms: RoomId[] = [];

export const runDrogoTriggers: PipelineFunction = (payload) => {
  const { command, gameState, nextRoom } = payload;
  const { drogoGuard } = gameState;

  //Check for new guard
  if (
    !drogoGuard &&
    command === "move" &&
    nextRoom &&
    !drogoFreeRooms.includes(nextRoom)
  ) {
    //possibly insert guard  }
  }

  //if drogo present
  if (drogoGuard) {
    //switch by command
  }

  //No action needed
  return payload;
};
