import { createFileRoute } from "@tanstack/react-router";

import { StoryContent } from "../features/story/StoryContent";

export const Route = createFileRoute("/story")({
  component: RouteComponent,
});

function RouteComponent() {
  console.log("Story route loaded");

  return (
    <>
      <StoryContent />
    </>
  );
}
