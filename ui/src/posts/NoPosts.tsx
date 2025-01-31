import { Stack, Typography } from "@mui/material";

export const NoPosts = () => {
  return (
    <Stack alignItems={"center"} gap={4} mt={5}>
      <Typography variant="h5" fontWeight={"light"}>
        No Posts, kind of empty...
      </Typography>
      <video
        autoPlay
        loop
        muted
        width="300"
        height="200"
        src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExY3g4dnBqdmdhOWUzbHN0N25meHIweDczdzBuYnE0NGxvajFrczFrciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ISOckXUybVfQ4/giphy.mp4"
      >
        No Posts
      </video>
    </Stack>
  );
};
