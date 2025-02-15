import { User } from "../../types";
import { LanguageOption } from "../../types/language-option";
import { EnhanceOption } from "../enums";

export type EnhanceCaptionRequest = {
  userID: User["_id"];
  caption: string;
  enhanceOption: EnhanceOption;
  translationLanguage?: LanguageOption["value"];
};
