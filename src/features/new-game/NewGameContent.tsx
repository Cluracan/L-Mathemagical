import { useState, type FormEvent, type ChangeEvent, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Card,
  Button,
  Container,
  Switch,
  TextField,
  Typography,
  FormGroup,
  FormControlLabel,
  FormHelperText,
} from "@mui/material";
import { initialGameState, useGameStore } from "../../store/useGameStore";
import entranceImage from "./images/entrance.png";
import { Link } from "@tanstack/react-router";
const validateName = (value: string): boolean => {
  const regex = /^[a-zA-Z0-9 ]+$/;
  return regex.test(value);
};

// Narrative Content
const newGameFeedback = {
  noName: "Please enter a team name, like 'Mel and Kim', or 'The A Team'",
  invalidName:
    "Please stick to alphanumeric characters (it helps with the save file)",
  modernMode:
    "This version includes an inventory log and a map - don't leave home without it!",
  classicMode:
    "The full 1984 experience. No map? No problem! You've got a pencil and paper, right?",
};

export const NewGameContent = () => {
  console.log("loading NewGameContent");
  const [name, setName] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [helperText, setHelperText] = useState<string>(" ");

  const modernMode = useGameStore((state) => state.modernMode);
  const navigate = useNavigate({ from: "/new" });

  useEffect(() => {
    useGameStore.setState(initialGameState);
  }, []);

  const handleToggleGameMode = () => {
    useGameStore.setState((state) => ({
      ...state,
      modernMode: !state.modernMode,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!name.trim()) {
      setError(true);
      setHelperText(newGameFeedback.noName);
    } else if (!validateName(name)) {
      setError(true);
      setHelperText(newGameFeedback.invalidName);
    } else {
      setError(false);
      setHelperText(" ");
      useGameStore.setState((state) => ({ ...state, playerName: name }));
      navigate({
        to: "/game",
      }).catch((error: unknown) => {
        console.error("Failed to start game:", error);
      });
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setName(e.target.value);
    if (error) {
      setError(false);
      setHelperText(" ");
    }
  };

  return (
    <Container
      sx={{
        backgroundImage: `url(${entranceImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "bottom",
        height: "90vh",
        width: "80vw ",
      }}
    >
      <Card
        component="form"
        onSubmit={handleSubmit}
        sx={{
          maxWidth: "600px",
          m: "auto",
          mt: 5,
          padding: 6,
          bgcolor: "rgba(28, 28, 28, 0.6)",
        }}
      >
        <Typography variant="h5" align="center" sx={{ mb: 4 }}>
          Welcome, adventurers!
        </Typography>
        <Typography variant="body1" align="left" gutterBottom>
          By what will you be known?
        </Typography>
        <TextField
          fullWidth
          label="Name"
          margin="normal"
          variant="outlined"
          onChange={handleChange}
          value={name}
          error={error}
          helperText={helperText}
        />
        <FormGroup>
          <FormControlLabel
            control={
              <Switch checked={modernMode} onChange={handleToggleGameMode} />
            }
            label={modernMode ? "Modern Mode" : "Classic Mode"}
          />
          <FormHelperText sx={{ height: "4rem" }}>
            {modernMode
              ? newGameFeedback.modernMode
              : newGameFeedback.classicMode}
          </FormHelperText>
        </FormGroup>
        <Container sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button variant="outlined" component={Link} to="/">
            Main Menu
          </Button>
          <Button variant="contained" type="submit">
            Start
          </Button>
        </Container>
      </Card>
    </Container>
  );
};
