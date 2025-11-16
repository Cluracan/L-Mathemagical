import { createFileRoute } from "@tanstack/react-router";
import { Background } from "../components/Background";
import { AboutContent } from "../features/about/AboutContent";
import wall from "../features/story/images/greenWall.webp";
export const Route = createFileRoute("/about")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Background imageSrc={wall} backgroundColor="#2b392e">
      <AboutContent />
    </Background>
  );
}
