import { createFileRoute } from "@tanstack/react-router";

import { HintsContent } from "../features/hints/HintsContent";
export const Route = createFileRoute("/hints")({
  component: RouteComponent,
});

function RouteComponent() {
  return <HintsContent />;
}
