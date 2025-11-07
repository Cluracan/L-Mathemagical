import { createFileRoute } from "@tanstack/react-router";
import { LoadContent } from "../features/load-game/LoadContent";

export const Route = createFileRoute("/load")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <LoadContent />
    </>
  );
}
