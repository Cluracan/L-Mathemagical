import {
  Button,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useRef, useState, type ChangeEvent } from "react";
import type { SaveFile } from "../../utils/saveGame";
import {
  isGameStoreKey,
  MAJOR_VERSION,
  useGameStore,
  type GameStoreState,
} from "../../store/useGameStore";
import { roomRegistry } from "../../engine/world/roomRegistry";
import { useNavigate } from "@tanstack/react-router";

import { HomeLink } from "../../components/HomeLink";
import { itemRegistry } from "../../engine/world/itemRegistry";

// Types
type LoadStatus =
  | { status: "empty" }
  | { status: "error" }
  | { status: "loading" }
  | { status: "gameLoaded"; gameData: GameStoreState };

// Helpers
function hasOwnProperty<X extends object, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, unknown> {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

const isVersion = (version: unknown): version is string => {
  const versionRegex = /^\d+\.\d+\.\d+$/;
  return typeof version === "string" && versionRegex.test(version);
};

const isSaveFile = (result: unknown): result is SaveFile => {
  if (!result || typeof result !== "object") {
    return false;
  }
  if (
    !hasOwnProperty(result, "version") ||
    !isVersion(result.version) ||
    !hasOwnProperty(result, "gameData") ||
    result.gameData === null ||
    typeof result.gameData !== "object"
  ) {
    return false;
  }
  const version = result.version.split(".");

  return (
    version[0] === MAJOR_VERSION &&
    Object.keys(result.gameData).every(isGameStoreKey)
  );
};

export const LoadContent = () => {
  // State
  const [loadStatus, setLoadStatus] = useState<LoadStatus>({ status: "empty" });
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate({ from: "/load" });

  // Handlers
  const handleChooseFileClick = () => {
    if (!inputRef.current) {
      return;
    }
    inputRef.current.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    setLoadStatus({ status: "loading" });
    const reader = new FileReader();
    reader.onload = ({ target }) => {
      const result = target?.result;
      if (typeof result !== "string") {
        console.error("Unexpected FileReader result");
        setLoadStatus({
          status: "error",
        });
        return;
      }
      try {
        const parsed: unknown = JSON.parse(result);

        if (!isSaveFile(parsed)) {
          console.error("Invalid save file or version mismatch");
          setLoadStatus({
            status: "error",
          });
          return;
        }
        const gameData = parsed.gameData;
        setLoadStatus({ status: "gameLoaded", gameData });
      } catch (err) {
        console.error("Failed to parse save file", err);
        setLoadStatus({ status: "error" });
      }
    };
    reader.onerror = () => {
      console.error("File read error", reader.error);
      setLoadStatus({ status: "error" });
    };
    reader.readAsText(file, "UTF-8");
    e.target.value = "";
  };

  const handleStartClick = () => {
    if (loadStatus.status !== "gameLoaded") {
      return;
    }
    useGameStore.setState(loadStatus.gameData);
    setLoadStatus({ status: "loading" });
    navigate({
      to: "/game",
    }).catch((error: unknown) => {
      console.error("Failed to start game:", error);
    });
  };

  // Render
  return (
    <>
      <HomeLink />
      <>
        <input
          ref={inputRef}
          type="file"
          accept=".sav"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        <Paper
          elevation={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            overflowY: "auto",
            height: "50vh",
            aspectRatio: 0.707,
            padding: 3,
            color: "#000",
            backgroundColor: "#fff8dc",
            "& .MuiTypography-root": {
              fontFamily: "charm",
              letterSpacing: 0.5,
            },
          }}
        >
          {loadStatus.status === "empty" && <EmptyContent />}
          {loadStatus.status === "error" && <ErrorContent />}
          {loadStatus.status === "loading" && <LoadingContent />}
          {loadStatus.status === "gameLoaded" && (
            <SaveGameContent gameData={loadStatus.gameData} />
          )}
          <Stack
            direction={"row"}
            sx={{ width: "100%", justifyContent: "space-around" }}
          >
            <Button
              variant={"contained"}
              onClick={handleChooseFileClick}
              aria-label="Choose a save file to load"
            >
              Choose File
            </Button>
            {loadStatus.status === "gameLoaded" && (
              <Button variant="contained" onClick={handleStartClick}>
                Continue
              </Button>
            )}
          </Stack>
        </Paper>
      </>
    </>
  );
};

const LoadingContent = () => {
  return (
    <>
      <CircularProgress
        enableTrackSlot
        size={"4rem"}
        sx={{ alignSelf: "center" }}
      />
      <Typography>Loading your save file...</Typography>
    </>
  );
};

const EmptyContent = () => {
  return <Typography>Choose your destiny...</Typography>;
};

const ErrorContent = () => {
  return (
    <>
      <Typography sx={{ color: "red" }}>
        Uh oh! Something has gone wrong!
      </Typography>
      <Typography>Please try again, or try a different save file.</Typography>
    </>
  );
};

const SaveGameContent = ({ gameData }: { gameData: GameStoreState }) => {
  const completedPuzzleCount = Object.values(gameData.puzzleState).filter(
    (puzzle) => puzzle.puzzleCompleted
  ).length;
  const roomName = roomRegistry.getRoomName(gameData.currentRoom).toLowerCase();
  const positionPrefix = roomRegistry.getPositionPrefix(gameData.currentRoom);
  const inventoryCount = itemRegistry
    .getItemList()
    .filter((item) => gameData.itemLocation[item] === "player").length;

  return (
    <>
      <Typography>The story so far...</Typography>
      <Typography>
        Going by the name {gameData.playerName}, you ventured into the palace
        some time ago.
      </Typography>
      <Typography>
        {gameData.modernMode
          ? "With the help of a magical map, and a little luck, "
          : "With only your wits and a pencil and paper to help, "}
        you have visited {gameData.visitedRooms.length} rooms thus far, and have
        solved {completedPuzzleCount}{" "}
        {completedPuzzleCount === 1 ? "puzzle" : "puzzles"}.
      </Typography>
      <Typography sx={{ mb: 2 }}>
        You are currently {positionPrefix} the {roomName}, carrying{" "}
        {String(inventoryCount)} {inventoryCount === 1 ? "item" : "items"}.
      </Typography>
    </>
  );
};
