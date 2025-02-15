import { Autocomplete, Box, TextField, Typography } from "@mui/material";
import { SyntheticEvent } from "react";
import { supportedLanguages } from "../../../constants/supported-languages";
import { LanguageOption } from "../../../types/language-option";
import getUnicodeFlagIcon from "country-flag-icons/unicode";

type Props = {
  onTranslationLanguageChosen: (
    event: SyntheticEvent,
    language: LanguageOption | null
  ) => void;
};

export const SelectTranslationLanguage = ({
  onTranslationLanguageChosen,
}: Props) => {
  return (
    <Autocomplete
      disableClearable
      size="small"
      sx={{ width: 150 }}
      onChange={onTranslationLanguageChosen}
      options={supportedLanguages}
      autoHighlight
      getOptionLabel={(option) =>
        `${getUnicodeFlagIcon(option.code)} ${option.label}`
      }
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;

        return (
          <Box
            key={key}
            component="li"
            sx={{ "& > img": { mr: 1 } }}
            {...optionProps}
          >
            <img
              loading="lazy"
              width="20"
              srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
              src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
              alt=""
            />
            <Typography noWrap>{option.label}</Typography>
          </Box>
        );
      }}
      renderInput={(params) => {
        return (
          <TextField
            placeholder="Language"
            {...params}
            slotProps={{
              htmlInput: {
                ...params.inputProps,
              },
            }}
          />
        );
      }}
    />
  );
};
