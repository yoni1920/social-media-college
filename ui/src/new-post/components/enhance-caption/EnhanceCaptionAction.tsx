import { SelectChangeEvent, Stack } from "@mui/material";
import { SyntheticEvent, useCallback, useState } from "react";
import { LanguageOption } from "../../../types/language-option";
import { EnhanceOption } from "../../enums";
import { EnhanceCaptionActionOptions } from "./EnchanceCaptionActionOptions";
import { GradientButton } from "../../../components/GradientButton";
import { AutoAwesome } from "@mui/icons-material";
import { EnhanceCaptionRequest, EnhanceCaptionResponse } from "../../types";
import { handleEnhanceCaption } from "../../utils/handle-enhance-caption";
import { User } from "../../../types";
import { GradientCircularProgress } from "../../../components/GradientCircularProgress";

type Props = {
  onEnhanceSuccess: (enhanceResponse?: EnhanceCaptionResponse) => void;
  onEnhanceError: (error: Error) => void;
  userID: User["_id"];
  originalCaption: string;
  removeEnhanceError: () => void;
};

export const EnhanceCaptionAction = ({
  onEnhanceError,
  onEnhanceSuccess,
  userID,
  originalCaption,
  removeEnhanceError,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [areEnhanceOptionsOpen, setAreEnhanceOptionsOpen] = useState(false);
  const [enhanceOption, setEnhanceOption] = useState<EnhanceOption>(
    EnhanceOption.PARAPHRASE
  );
  const [translationLanguage, setTranslationLanguage] =
    useState<LanguageOption | null>(null);

  const handleEnhanceOptionChange = useCallback(
    (event: SelectChangeEvent<EnhanceOption>) => {
      setEnhanceOption(event.target.value as EnhanceOption);
    },
    []
  );

  const handleTranslationLanguageChange = useCallback(
    (_event: SyntheticEvent, language: LanguageOption | null) => {
      setTranslationLanguage(language);
    },
    []
  );

  const onEnchanceButtonClick = useCallback(() => {
    setAreEnhanceOptionsOpen(true);
    removeEnhanceError();
  }, [removeEnhanceError]);

  const onCloseEnhanceOptions = useCallback(() => {
    setAreEnhanceOptionsOpen(false);
  }, []);

  const onSubmitEnhanceCaption = useCallback(async () => {
    const enhanceRequest: EnhanceCaptionRequest = {
      userID,
      caption: originalCaption,
      enhanceOption,
      ...(translationLanguage && {
        translationLanguage: translationLanguage.value,
      }),
    };

    setIsLoading(true);
    await handleEnhanceCaption(
      enhanceRequest,
      onEnhanceSuccess,
      onEnhanceError
    );

    setAreEnhanceOptionsOpen(false);
    setIsLoading(false);
  }, [
    enhanceOption,
    onEnhanceError,
    onEnhanceSuccess,
    originalCaption,
    translationLanguage,
    userID,
  ]);

  return (
    <Stack sx={{ marginLeft: "auto" }}>
      {isLoading ? (
        <GradientCircularProgress
          size={"1.75rem"}
          sx={{ mt: 0.5, mr: 2 }}
          thickness={5}
        />
      ) : areEnhanceOptionsOpen ? (
        <EnhanceCaptionActionOptions
          enhanceOption={enhanceOption}
          onCloseEnhanceOptions={onCloseEnhanceOptions}
          onEnhanceOptionChosen={handleEnhanceOptionChange}
          onTranslationLanguageChosen={handleTranslationLanguageChange}
          onSubmitEnhanceCaption={onSubmitEnhanceCaption}
        />
      ) : (
        <GradientButton
          text="Enhance"
          endIcon={<AutoAwesome />}
          onClick={onEnchanceButtonClick}
          size="small"
          sx={{
            paddingX: "0.75rem",
          }}
        />
      )}
    </Stack>
  );
};
