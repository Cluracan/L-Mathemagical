import type { HandleCommand } from "../dispatchCommand";

export const handleBudge: HandleCommand = (args) => {
  return args.gameState;
};

//chest and telephone will be joint triggers from telephone NPC, so moving chest completes the puzzle,
//perhaps the puzzle isn't complete until chest is moved, actually, so you can always keep ringing
//until you move the chest, at which point the cable snaps and the line is then dead
