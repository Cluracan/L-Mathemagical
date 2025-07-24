import { createFileRoute } from "@tanstack/react-router";

import { StoryCard } from "../features/story/StoryCard";

export const Route = createFileRoute("/story")({
  component: RouteComponent,
});

function RouteComponent() {
  console.log("Story route loaded");

  return (
    <>
      <StoryCard />
    </>
  );
}
