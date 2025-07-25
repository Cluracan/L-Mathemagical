import { createFileRoute } from "@tanstack/react-router";
import { IndexContent } from "../features/index/IndexComponent";

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
