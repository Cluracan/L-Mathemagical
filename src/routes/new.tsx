import { createFileRoute } from "@tanstack/react-router";
import { NewGameContent } from "../features/new-game/NewGameContent";
export const Route = createFileRoute("/new")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <NewGameContent />
    </>
  );
}
