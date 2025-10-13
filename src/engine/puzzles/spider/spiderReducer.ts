import { produce } from "immer";
import {
  edgeMap,
  getEdgeCountMessage,
  spiderFeedback,
  type Direction,
  type Edge,
  type SpiderState,
} from "./spiderConstants";

// Types
type SpiderAction = { type: "input"; direction: Direction } | { type: "reset" };

// Helpers
const hasEdge = (edgesBitset: number, edgeIndex: Edge) => {
  return (edgesBitset & (1 << edgeIndex)) !== 0;
};

const addEdge = (edgesBitset: number, edgeIndex: Edge) => {
  return edgesBitset | (1 << edgeIndex);
};

const countEdges = (edgesBitset: number) => {
  return edgesBitset.toString(2).split("1").length - 1;
};

// Reducer
export function spiderReducer(state: SpiderState, action: SpiderAction) {
  switch (action.type) {
    case "input": {
      return produce(state, (draft) => {
        draft.feedback.push(spiderFeedback.move[action.direction]);
        const nextEdge = edgeMap[draft.currentEdge][action.direction];
        if (hasEdge(draft.edgesTraversed, nextEdge)) {
          draft.feedback.push(spiderFeedback.repeatedEdge);
          draft.status = "failedAttempt";
        } else {
          draft.edgesTraversed = addEdge(draft.edgesTraversed, nextEdge);
          draft.currentEdge = nextEdge;
          const edgeCount = countEdges(draft.edgesTraversed);
          if (edgeCount === 24) {
            draft.feedback.push(...spiderFeedback.success);
            draft.puzzleCompleted = true;
            draft.status = "failedAttempt";
          } else {
            draft.feedback.push(getEdgeCountMessage(edgeCount));
          }
        }
      });
    }
    case "reset": {
      return produce(state, (draft) => {
        draft.feedback.push(spiderFeedback.start);
        draft.status = "inProgress";
        draft.edgesTraversed = 1;
        draft.currentEdge = 0;
      });
    }
  }
}
