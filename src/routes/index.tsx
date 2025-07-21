import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useGameMode } from "../store/useGameMode";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const gameMode = useGameMode((state) => state.gameMode);
  const toggleGameMode = useGameMode((state) => state.toggleGameMode);
  return (
    <div className="p-2">
      <div className="p-2 flex gap-2">
        <Link to="/adventure" className="[&.active]:font-bold">
          Adventure
        </Link>
        <br />
        <div>Game mode: {gameMode}</div>
        <button
          onClick={() => toggleGameMode()}
          className="bg-blue-500 text-white px-2 py-1 rounded"
        >
          Change mode
        </button>
      </div>
      <h3>Welcome Home!</h3>
    </div>
  );
}
