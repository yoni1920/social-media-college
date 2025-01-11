import { Stack, Typography } from "@mui/material";
import { useCounterStore } from "../store/counter";

export const OtherCounter = () => {
  const count = useCounterStore((state) => state.count);
  const nestedCount = useCounterStore((state) => state.nestedCount.count);
  const nestedCool = useCounterStore((state) => state.nestedCount.cool);

  return (
    <Stack>
      <Typography>Count is {count}</Typography>
      <Typography>Nested Count is {nestedCount}</Typography>
      <Typography>Nested cool is {`${nestedCool}`}</Typography>
    </Stack>
  );
};
