import { createFileRoute } from "@tanstack/react-router";
import { GameContent } from "../features/game/Game";

export const Route = createFileRoute("/game")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <GameContent />
    </>
  );
}
