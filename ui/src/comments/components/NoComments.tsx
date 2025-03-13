import { Stack, Typography } from "@mui/material";

export const NoComments = () => {
  return (
    <Stack alignItems={"center"} gap={4} mt={5}>
      <Typography variant="h5" fontWeight={"light"}>
        No Comments, kind of empty...
      </Typography>
      <video
        autoPlay
        loop
        muted
        width="350"
        height="250"
        src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExd2d3MGF0NGp5cDFiZnJsejZxb3Zta3M4dmpkd2VlNmU2Zm1xZ3RzbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/OSuaE6AknuRc7syZXp/giphy.mp4"
      >
        No Comments
      </video>
    </Stack>
  );
};
