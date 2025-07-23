import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/new-game")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/new-game"!</div>;
}
