import { createFileRoute } from "@tanstack/react-router";
import { StoryContent } from "../features/story/StoryContent";
import { Background } from "../components/Background";
import wall from "../features/story/images/greenWall.png";

export const Route = createFileRoute("/story")({
  component: RouteComponent,
});

function RouteComponent() {
  console.log("Story route loaded");

  return (
    <>
      <Background src={wall}>
        <StoryContent />
      </Background>
    </>
  );
}
