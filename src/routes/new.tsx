import { createFileRoute } from "@tanstack/react-router";
import { NewGameContent } from "../features/new-game/NewGameContent";
import { Background } from "../components/Background";
import entrance from "../features/new-game/images/entrance.webp";

export const Route = createFileRoute("/new")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Background imageSrc={entrance} backgroundColor="#195072">
        <NewGameContent />
      </Background>
    </>
  );
}
