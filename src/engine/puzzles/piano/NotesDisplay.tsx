import { useEffect, useRef } from "react";
import type { NoteId } from "./pianoConstants";
import VexFlow from "vexflow";

type NotesDisplayProps = { playedNotes: NoteId[] };
export const NotesDisplay = ({ playedNotes }: NotesDisplayProps) => {
  const vexFlowRef = useRef<HTMLDivElement>(null);
  const { Renderer, Stave } = VexFlow;

  useEffect(() => {
    const vexFlowNode = vexFlowRef.current;
    if (!vexFlowNode) return;
    const vexFlowNodeWidth = vexFlowNode.getBoundingClientRect().width;
    const renderer = new Renderer(vexFlowNode, Renderer.Backends.SVG);
    renderer.resize(vexFlowNodeWidth, 80);
    const context = renderer.getContext();
    const stave = new Stave(10, -16, vexFlowNodeWidth - 20);
    stave.addClef("treble");
    stave.setContext(context).draw();
    return () => {
      vexFlowNode.innerHTML = "";
    };
  }, []);
  return (
    <>
      <div
        ref={vexFlowRef}
        style={{ width: "60%", backgroundColor: "white" }}
      ></div>
      {playedNotes.join(",")}
    </>
  );
};
