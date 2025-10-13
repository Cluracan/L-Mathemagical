import { useEffect, useRef } from "react";
import { useGameStore } from "../../../store/useGameStore";
import { useWindowDimensions } from "../../../features/hooks/useWindowDimensions";
import { SnookerEngine } from "./snookerEngine";

const CANVAS_RATIO = 0.4;

export const SnookerCanvas = ({
  onAnimationComplete,
}: {
  onAnimationComplete: () => void;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D>(null);
  const engineRef = useRef<SnookerEngine | null>(null);
  const angle = useGameStore((state) => state.puzzleState.snooker.angle);
  const action = useGameStore((state) => state.puzzleState.snooker.action);
  let { width } = useWindowDimensions();
  const { height } = useWindowDimensions();
  if (width < height) width = height;
  const cssWidth = width * CANVAS_RATIO;
  const cssHeight = height * CANVAS_RATIO;

  useEffect(() => {
    if (!canvasRef.current) return;
    const context = canvasRef.current.getContext("2d");

    // Set display size (css pixels)   https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio
    canvasRef.current.style.width = `${String(cssWidth)}px`;
    canvasRef.current.style.height = `${String(cssHeight)}px`;

    // Set actual size in memory (scaled to account for extra pixel density).
    const dpr = window.devicePixelRatio || 1;
    canvasRef.current.width = width * CANVAS_RATIO * dpr;
    canvasRef.current.height = height * CANVAS_RATIO * dpr;
    // Normalize coordinate system to use CSS pixels.
    context?.scale(dpr, dpr);

    if (!context) return;
    contextRef.current = context;
    engineRef.current = new SnookerEngine(
      contextRef.current,
      CANVAS_RATIO * width,
      CANVAS_RATIO * height
    );

    engineRef.current.drawTable();
  }, [width]);

  useEffect(() => {
    if (!engineRef.current) return;

    switch (action) {
      case "hit":
        engineRef.current
          .hitBall(angle)
          .then(() => {
            onAnimationComplete();
          })
          .catch((error: unknown) => {
            console.error("Animation failed:", error);
            onAnimationComplete();
          });
        break;
      case "reset":
        engineRef.current.resetTable();
        break;
    }
    return () => {
      engineRef.current?.cleanUpAnimation();
    };
  }, [angle, action]);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          margin: "2rem",
        }}
      />
    </>
  );
};
