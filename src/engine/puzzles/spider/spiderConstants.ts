// --- Types ---
export interface SpiderState {
  puzzleCompleted: boolean;
  currentEdge: Edge;
  edgesTraversed: number;
  feedback: string[];
  status: "instructions" | "inProgress" | "failedAttempt";
}

// --- Static Data ---
export const spiderFeedback = {
  instructions: [
    '"Right," says the spider. "If I spin a special web that encloses the room, the Drogos\' magic will be defeated."\n\n',
    '"This room has four edges where the walls join, four edges where the walls meet the floor, and four edges where the walls meet the ceiling.',
    'I must spin a silk thread that passes along each of these twelve edges twice - once in each direction. The thread must not be broken and, as I only have a limited supply, I must not go along any edge more than twice."\n\n',
    '"The trouble is that I am a rather old, short-sighted spider and you\'ll have to help me. Now, if you could tell me whether to turn LEFT or RIGHT when I reach the end of each edge, I might just manage it."\n\n',
    '"Let me know when you are ready to start."',
  ],
  start:
    '\n\n"Right," says the spider. "I have reached the end of the first edge. Tell me whether to go LEFT or RIGHT.',
  move: { L: "Turn left", R: "Turn right" },
  repeatedEdge:
    '"I can\'t do that. I have already been along that edge from this direction. The only thing to do is to wind up all this thread and start again. What a mess!" says the spider wearily.',
  success: [
    '"At last," says the exhausted spider. It creeps away into a hole in the plaster for a sleep.',
    "The room starts to shake, first gently, then more violently.",
    "Suddenly, in the middle of the room appears a small gold ring.",
  ],
  storyLineSuccess:
    "The room stops shaking, and your eyes are drawn to the gold ring in the middle of the room",
  storyLineFailure: `"Please let me know when you are ready to try again," says the spider. "I'd like to help you if I can!"`,
};

export const getEdgeCountMessage = (edgeCount: number) => {
  return `"OK. That makes ${String(edgeCount)} ${edgeCount > 1 ? "edges" : "edge"} so far."`;
};

export const directionText = { L: "Left", R: "Right" } as const;
export type Direction = keyof typeof directionText;

// --- Static Data ---
export const edgeMap = {
  0: { L: 18, R: 2 },
  1: { L: 7, R: 16 },
  2: { L: 20, R: 4 },
  3: { L: 1, R: 18 },
  4: { L: 22, R: 6 },
  5: { L: 3, R: 20 },
  6: { L: 16, R: 0 },
  7: { L: 5, R: 22 },
  8: { L: 10, R: 19 },
  9: { L: 17, R: 15 },
  10: { L: 12, R: 21 },
  11: { L: 19, R: 9 },
  12: { L: 14, R: 23 },
  13: { L: 21, R: 11 },
  14: { L: 8, R: 17 },
  15: { L: 23, R: 13 },
  16: { L: 15, R: 8 },
  17: { L: 0, R: 7 },
  18: { L: 9, R: 10 },
  19: { L: 2, R: 1 },
  20: { L: 11, R: 12 },
  21: { L: 4, R: 3 },
  22: { L: 13, R: 14 },
  23: { L: 6, R: 5 },
} as const;
export type Edge = keyof typeof edgeMap;

// --- Initial State ---
export const initialSpiderState: SpiderState = {
  puzzleCompleted: false,
  currentEdge: 0,
  edgesTraversed: 1,
  feedback: [...spiderFeedback.instructions],
  status: "instructions",
};
