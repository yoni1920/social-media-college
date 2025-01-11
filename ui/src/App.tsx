import { Button, Container, Stack, Typography } from "@mui/material";
import "./App.css";
import { OtherCounter } from "./components/OtherCounter";
import { useCounterStore } from "./store/counter";
import { useCallback } from "react";

function App() {
  const { count, increment, decrement, incrementDeep } = useCounterStore();

  const onIncrement = useCallback(() => {
    increment();
    incrementDeep();
  }, [increment, incrementDeep]);

  return (
    <Container maxWidth="sm">
      <Stack gap={5} alignItems="center">
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          Material UI Vite.js example in TypeScript
        </Typography>

        <Stack direction="row" gap={3} alignItems={"center"}>
          <Button onClick={onIncrement} variant="contained" color="secondary">
            Add +
          </Button>
          <Typography>Count: {count}</Typography>
          <Button onClick={decrement} variant="contained">
            Sub -
          </Button>
        </Stack>

        <OtherCounter />
      </Stack>

      {/* <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={decrement}>sub -</button>
        <p>count is {count}</p>
        <button onClick={increment}>add +</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
        <OtherCounter />
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
    </Container>
  );
}

export default App;
