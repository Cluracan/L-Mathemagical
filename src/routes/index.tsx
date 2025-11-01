import { createFileRoute } from "@tanstack/react-router";
import { IndexContent } from "../features/index/IndexContent";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <>
      <IndexContent />
    </>
  );
}
