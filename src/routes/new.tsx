import { createFileRoute } from "@tanstack/react-router";
import { NewGameContent } from "../features/new-game/NewGameContent";
import { Background } from "../components/Background";
import entrance from "../features/new-game/images/entrance.png";

export const Route = createFileRoute("/new")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Background src={entrance}>
        <NewGameContent />
      </Background>
    </>
  );
}
