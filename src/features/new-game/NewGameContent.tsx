import { useState, type FormEvent, type ChangeEvent } from "react";
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
import { useGameMode } from "../../store/useGameMode";
import entranceImage from "./images/entrance.png";

const validateName = (value: string): boolean => {
  const regex = /^[a-zA-Z0-9 ]+$/;
  return regex.test(value);
};

export const NewGameContent = () => {
  const [name, setName] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [helperText, setHelperText] = useState<string>(" ");

  const { modernMode, toggleGameMode } = useGameMode();

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!name.trim()) {
      setError(true);
      setHelperText(
        "Please enter a team name, like 'Mel and Kim', or 'The A Team'"
      );
    } else if (!validateName(name)) {
      setError(true);
      setHelperText(
        "Please stick to alphanumeric characters (it helps with the save file)"
      );
    } else {
      setError(false);
      setHelperText(" ");
      console.log(e);
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
              <Switch defaultChecked={modernMode} onChange={toggleGameMode} />
            }
            label={modernMode ? "Modern Mode" : "Classic Mode"}
          />
          <FormHelperText sx={{ height: "4rem" }}>
            {modernMode
              ? "This version includes an inventory log and a map - don't leave home without it!"
              : "The full 1984 experience. No map? No problem! You've got a pencil and paper, right\?"}
          </FormHelperText>
        </FormGroup>
        <Container sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button variant="outlined" href="/">
            Back
          </Button>
          <Button variant="contained" type="submit">
            Start
          </Button>
        </Container>
      </Card>
    </Container>
  );
};
