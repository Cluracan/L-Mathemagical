import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/hints")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello from Hints!</div>;
}
