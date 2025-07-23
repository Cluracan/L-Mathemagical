import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/load-game")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/load-game"!</div>;
}
