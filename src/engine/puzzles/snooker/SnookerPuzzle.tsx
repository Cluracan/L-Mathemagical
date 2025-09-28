import { Button, InputAdornment, TextField } from "@mui/material";
import { PuzzleActions } from "../../../components/puzzles/PuzzleActions";
import { PuzzleContainer } from "../../../components/puzzles/PuzzleContainer";
import { PuzzleFeedback } from "../../../components/puzzles/PuzzleFeedback";
import { PuzzleHeader } from "../../../components/puzzles/PuzzleHeader";
import { useGameStore } from "../../../store/useGameStore";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useWindowDimensions } from "../../../features/hooks/useWindowDimensions";
import { SnookerEngine } from "./snookerEngine";
import { produce } from "immer";
import { initialSnookerState } from "./snookerConstants";

//Constants
const MAX_ANGLE = 999;
const CANVAS_RATIO = 0.4;

//Main Component
export const SnookerPuzzle = () => {
  const feedback = useGameStore((state) => state.puzzleState.snooker.feedback);
  const puzzleCompleted = useGameStore(
    (state) => state.puzzleState.snooker.puzzleCompleted
  );
  const [angleInput, setAngleInput] = useState(0);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (isNaN(Number(e.target.value)) || Number(e.target.value) > MAX_ANGLE)
      return;
    setAngleInput(Number(e.target.value));
  };

  const handleHit = () => {
    useGameStore.setState((state) =>
      produce(state, (draft) => {
        draft.puzzleState.snooker.angle = angleInput;
      })
    );
  };

  const onAnimationComplete = () => {
    useGameStore.setState((state) =>
      produce(state, (draft) => {
        draft.puzzleState.snooker.feedback = "In the hole";
      })
    );
  };

  const handleReset = () => {
    useGameStore.setState((state) =>
      produce(state, (draft) => {
        draft.puzzleState.snooker = initialSnookerState;
      })
    );
  };

  const handleLeave = () => {};
  return (
    <>
      <PuzzleContainer>
        <PuzzleHeader title="Snooker Puzzle" description="Hit the ball!" />
        <Canvas onAnimationComplete={onAnimationComplete} />
        <PuzzleFeedback feedback={[feedback]} height="8vh" />
        <PuzzleActions
          handleLeave={handleLeave}
          handleReset={handleReset}
          puzzleCompleted={puzzleCompleted}
        >
          <TextField
            label="Angle"
            onChange={handleChange}
            value={angleInput}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">&deg;</InputAdornment>
                ),
              },
              htmlInput: {
                style: { textAlign: "right", width: "4ch" },
                inputMode: "numeric",
              },
            }}
          />
          <Button onClick={handleHit}>Hit</Button>
        </PuzzleActions>
      </PuzzleContainer>
    </>
  );
};

const Canvas = ({
  onAnimationComplete,
}: {
  onAnimationComplete: () => void;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D>(null);
  const engineRef = useRef<SnookerEngine>(null);
  const angle = useGameStore((state) => state.puzzleState.snooker.angle);
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    if (!canvasRef.current) return;
    contextRef.current = canvasRef.current.getContext("2d");
    if (!contextRef.current) return;
    engineRef.current = new SnookerEngine(
      contextRef.current,
      CANVAS_RATIO * width,
      CANVAS_RATIO * height
    );
    if (!engineRef.current) return;

    engineRef.current.drawTable();
  }, [width]);

  useEffect(() => {
    if (!engineRef.current) return;
    if (!angle) {
      engineRef.current.resetTable();
    } else {
      engineRef.current.hitBall(angle).then(() => {
        onAnimationComplete();
      });
    }
  }, [angle]);

  return (
    <>
      <canvas
        ref={canvasRef}
        width={CANVAS_RATIO * width}
        height={CANVAS_RATIO * height}
        style={{ margin: "2rem" }}
      />
    </>
  );
};
