import { useEffect, useRef, useState } from "react";
import { pianoKeys, TARGET_MELODY, type NoteId } from "./pianoConstants";
import { Renderer, Stave, StaveNote, Formatter, Accidental } from "vexflow";
import { VisuallyHidden } from "../../../components/VisuallyHidden";

// Types
interface NotesDisplayProps {
  playedNotes: NoteId[];
}

// Constants
const HORIZONTAL_PADDING = 10;
const VERTICAL_PADDING = 10;

export const NotesDisplay = ({ playedNotes }: NotesDisplayProps) => {
  const vexFlowRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const vexFlowNode = vexFlowRef.current;
    if (!vexFlowNode) return;

    const resizeObserver = new ResizeObserver(() => {
      setContainerWidth(vexFlowNode.getBoundingClientRect().width);
    });
    resizeObserver.observe(vexFlowNode);

    setContainerWidth(vexFlowNode.getBoundingClientRect().width);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const vexFlowNode = vexFlowRef.current;
    if (!vexFlowNode || containerWidth === 0) return;

    const renderer = new Renderer(vexFlowNode, Renderer.Backends.SVG);
    const stave = new Stave(0, 0, containerWidth - 2 * HORIZONTAL_PADDING, {
      spaceAboveStaffLn: 1,
      spaceBelowStaffLn: 2,
      spacingBetweenLinesPx: 10,
      // https://www.vexflow.com/build/docs/stave.html
    });
    stave.addClef("treble");

    const staveBounds = stave.getBoundingBox();
    const totalHeight = staveBounds.getH();

    renderer.resize(containerWidth, totalHeight);
    const context = renderer.getContext();

    context.fillStyle = "#555";
    context.strokeStyle = "#555";

    stave.setX(HORIZONTAL_PADDING);
    stave.setY(VERTICAL_PADDING);

    stave.setContext(context).draw();
    const notes = playedNotes.map((noteId) => {
      const noteName = pianoKeys[noteId].noteName.toLowerCase();
      const staveNote = new StaveNote({
        keys: [`${noteName}/4`],
        duration: "q",
      });
      //Apply flat notation
      if (noteName[1] === "b") {
        staveNote.addModifier(new Accidental("b"));
      }
      return staveNote;
    });
    //fill remaining notes with spacers
    while (notes.length < TARGET_MELODY.length) {
      const spacer = new StaveNote({
        keys: ["b/4"],
        duration: "qr",
      });
      spacer.setStyle({
        fillStyle: "transparent",
        strokeStyle: "transparent",
      });
      notes.push(spacer);
    }
    Formatter.FormatAndDraw(context, stave, notes);
    return () => {
      vexFlowNode.innerHTML = "";
    };
  }, [playedNotes, containerWidth]);

  return (
    <>
      <div
        ref={vexFlowRef}
        style={{
          width: "60%",
          background: "linear-gradient(to bottom, #ffeaa7, #fab1a0)",
          borderRadius: "8px",
        }}
        aria-hidden="true"
      ></div>
      <VisuallyHidden>
        {playedNotes.length === 0
          ? "No notes played yet"
          : `Played notes: ${playedNotes.map((noteId) => pianoKeys[noteId].noteName).join(", ")}`}
      </VisuallyHidden>
    </>
  );
};
