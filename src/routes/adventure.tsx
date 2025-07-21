import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/adventure")({
  component: Adventure,
});

function Adventure() {
  return (
    <div className="p-2">
      <Link to="/" className="[&.active]:font-bold">
        Home
      </Link>
      Hello from Adventure!
    </div>
  );
}
