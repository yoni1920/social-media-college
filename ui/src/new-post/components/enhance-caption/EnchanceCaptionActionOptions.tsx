import { AutoAwesome, Clear } from "@mui/icons-material";
import {
  Fade,
  IconButton,
  SelectChangeEvent,
  Stack,
  Tooltip,
} from "@mui/material";
import { SyntheticEvent } from "react";
import { GradientIconButton } from "../../../components/GradientIconButton";
import { LanguageOption } from "../../../types/language-option";
import { EnhanceOption } from "../../enums";
import { SelectEnhanceOption } from "./SelectEnhanceOption";
import { SelectTranslationLanguage } from "./SelectTranslationLanguage";

export type EnhanceCaptionActionOptionsProps = {
  onCloseEnhanceOptions: () => void;
  onEnhanceOptionChosen: (event: SelectChangeEvent<EnhanceOption>) => void;
  onTranslationLanguageChosen: (
    event: SyntheticEvent,
    language: LanguageOption | null
  ) => void;
  enhanceOption: EnhanceOption;
  onSubmitEnhanceCaption: () => Promise<void>;
};

export const EnhanceCaptionActionOptions = ({
  onCloseEnhanceOptions,
  onEnhanceOptionChosen,
  onTranslationLanguageChosen,
  enhanceOption,
  onSubmitEnhanceCaption,
}: EnhanceCaptionActionOptionsProps) => {
  return (
    <Fade in timeout={200}>
      <Stack direction={"row"} alignItems={"center"} gap={2}>
        <Stack direction={"row"} alignItems={"center"} gap={1}>
          <SelectEnhanceOption
            enhanceOption={enhanceOption}
            onEnhanceOptionChosen={onEnhanceOptionChosen}
          />

          <SelectTranslationLanguage
            onTranslationLanguageChosen={onTranslationLanguageChosen}
          />
        </Stack>

        <Stack direction={"row"} alignItems={"center"} gap={0.5}>
          <Tooltip title="Enhance">
            <div>
              <GradientIconButton
                sx={{ padding: "0.5rem" }}
                size={"small"}
                icon={<AutoAwesome fontSize="small" />}
                onClick={onSubmitEnhanceCaption}
              />
            </div>
          </Tooltip>

          <IconButton
            size="small"
            disableRipple
            onClick={onCloseEnhanceOptions}
          >
            <Clear sx={{ fontSize: 18 }} />
          </IconButton>
        </Stack>
      </Stack>
    </Fade>
  );
};
