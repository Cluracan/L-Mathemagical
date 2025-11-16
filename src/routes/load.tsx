import { createFileRoute } from "@tanstack/react-router";
import { LoadContent } from "../features/load-game/LoadContent";
import { Background } from "../components/Background";
import desk from "../features/load-game/images/desk.webp";

export const Route = createFileRoute("/load")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Background imageSrc={desk} backgroundColor="rgba(70, 50, 7, 1)">
        <LoadContent />
      </Background>
    </>
  );
}
