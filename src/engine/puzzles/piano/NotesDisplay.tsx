import { useEffect, useRef } from "react";
import { pianoKeys, TARGET_MELODY, type NoteId } from "./pianoConstants";
import VexFlow from "vexflow";

//Constants
const HORIZONTAL_PADDING = 10;
const VERTICAL_PADDING = 10;

type NotesDisplayProps = { playedNotes: NoteId[] };
export const NotesDisplay = ({ playedNotes }: NotesDisplayProps) => {
  const vexFlowRef = useRef<HTMLDivElement>(null);
  const { Renderer, Stave, StaveNote, Formatter, Accidental } = VexFlow;

  useEffect(() => {
    const vexFlowNode = vexFlowRef.current;
    if (!vexFlowNode) return;
    const vexFlowNodeWidth = vexFlowNode.getBoundingClientRect().width;
    const renderer = new Renderer(vexFlowNode, Renderer.Backends.SVG);
    const stave = new Stave(0, 0, vexFlowNodeWidth - 2 * HORIZONTAL_PADDING);
    stave.addClef("treble");

    const staveBounds = stave.getBoundingBox();
    const totalHeight = staveBounds.getH();

    renderer.resize(vexFlowNodeWidth, totalHeight);
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
  }, [playedNotes]);
  return (
    <>
      <div
        ref={vexFlowRef}
        style={{
          width: "60%",
          background: "linear-gradient(to bottom, #ffeaa7, #fab1a0)",
          borderRadius: "8px",
        }}
      ></div>
    </>
  );
};
