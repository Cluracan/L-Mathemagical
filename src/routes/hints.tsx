import { createFileRoute } from "@tanstack/react-router";

import { HintsContent } from "../features/hints/HintsContent";
import { Background } from "../components/Background";
export const Route = createFileRoute("/hints")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Background imageSrc={null} backgroundColor="#2b392e">
      <HintsContent />
    </Background>
  );
}
