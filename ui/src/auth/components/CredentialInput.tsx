import { TextField, TextFieldProps } from "@mui/material";

export const CredentialInput = (props: Omit<TextFieldProps, "size">) => {
  const { sx, ...otherProps } = props;

  return (
    <TextField sx={{ ...sx, width: "60%" }} size="small" {...otherProps} />
  );
};
