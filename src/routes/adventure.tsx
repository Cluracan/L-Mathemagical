import { createFileRoute } from "@tanstack/react-router";
import { AdventureContent } from "../features/adventure/adventureContent";

export const Route = createFileRoute("/adventure")({
  component: Adventure,
});

function Adventure() {
  return (
    <>
      <AdventureContent />
    </>
  );
}
