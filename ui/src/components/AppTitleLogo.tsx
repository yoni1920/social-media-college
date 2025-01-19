import { Typography, TypographyProps, useTheme } from "@mui/material";

export const AppTitleLogo = ({
  variant = "h3",
  sx,
  ...props
}: TypographyProps) => {
  const theme = useTheme();

  return (
    <Typography
      variant={variant}
      fontWeight={"bold"}
      fontFamily={"Playwrite IN"}
      paddingY={1}
      sx={{
        background: theme.palette.gradient.main,
        color: "transparent",
        backgroundClip: "text",
        ...sx,
      }}
      {...props}
    >
      WeSocial.io
    </Typography>
  );
};
