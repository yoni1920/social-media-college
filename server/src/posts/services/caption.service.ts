import { SchemaType } from "@google/generative-ai";
import { getGeminiModel } from "../../utils/ai-content";
import { EnhanceCaptionRequestDTO } from "../dto-schema/enhance-caption";
import { EnhanceOption } from "../types";
import { delay } from "../../utils/delay";

const model = getGeminiModel({
  description:
    "Given a user caption in 'CAPTION' variable and a nullable target translation language 'TARGET_LANGUAGE' variable, first you translate the caption to the TARGET_LANGUAGE variable if the 'TARGET_LANGUAGE' variable exists, then either 'PARAPHRASE', 'CONCISE', or 'ELABORATE' the 'CAPTION' with the perspective as if you wrote the caption",
  type: SchemaType.OBJECT,
  properties: {
    status: {
      type: SchemaType.STRING,
      nullable: false,
      description: `Status 'SUCCESS' if successfully paraphrased, elaborated, or to concise the users caption, 'FAILED' if the user's caption did not provide enough information to concise, or if the user's caption does not have enough context to elaborate on, or other failures`,
    },
    caption: {
      type: SchemaType.STRING,
      nullable: true,
      description: `One alternative caption option from the provided user caption in 'CAPTION' variable after first translating caption to 'TARGET_LANGUAGE' language variable if exists, then to paraphrase, elaborate, or to concise the caption.`,
    },
    reason: {
      type: SchemaType.STRING,
      nullable: true,
      description: `If Status is 'SUCCESS' should be null, if 'FAILED' then should provide reason`,
    },
  },
  required: ["status"],
});

const buildConsice = (caption: string, translationLanguage?: string) => {
  if (translationLanguage) {
    return `Given CAPTION: '${caption}', TARGET_LANGUAGE: '${translationLanguage}', First translate the caption into the TARGET_LANGUAGE. Then make the CAPTION more concise without losing its original meaning and as if you wrote the caption.`;
  }

  return `Given CAPTION: '${caption}', Keep the original language of the CAPTION, and make the CAPTION more concise without losing its original meaning and as if you wrote the CAPTION.`;
};

const buildElaborate = (caption: string, translationLanguage?: string) => {
  if (translationLanguage) {
    return `Given CAPTION: '${caption}', TARGET_LANGUAGE: '${translationLanguage}', First translate the caption into the TARGET_LANGUAGE. Then, slightly elaborate the CAPTION without losing its original meaning with the perspective as if you wrote the caption, and don't pass 2,000 characters`;
  }

  return `Given CAPTION: '${caption}', Keep the original language of the CAPTION, and slightly elaborate the following CAPTION without losing its original meaning with the perspective as if you wrote the caption, and don't pass 2,000 characters.`;
};

const buildParaphrase = (caption: string, translationLanguage?: string) => {
  if (translationLanguage) {
    return `Given CAPTION: '${caption}', TARGET_LANGUAGE: '${translationLanguage}', First translate the caption into the TARGET_LANGUAGE. Then paraphrase the CAPTION without losing its original meaning with the perspective as if you wrote the caption.`;
  }

  return `Given CAPTION: '${caption}', Keep the original language of the caption, and paraphrase the CAPTION without losing its original meaning with the perspective as if you wrote the caption.`;
};

const buildPromptByEnhanceOption: Record<
  EnhanceOption,
  (
    caption: EnhanceCaptionRequestDTO["caption"],
    translationLanguage: EnhanceCaptionRequestDTO["translationLanguage"]
  ) => string
> = {
  CONCISE: buildConsice,
  ELABORATE: buildElaborate,
  PARAPHRASE: buildParaphrase,
};

const enhanceCaption = async ({
  caption,
  enhanceOption,
  translationLanguage,
}: EnhanceCaptionRequestDTO) => {
  const prompt = buildPromptByEnhanceOption[enhanceOption](
    caption,
    translationLanguage
  );

  const result = await model.generateContent(prompt);

  return JSON.parse(result.response.text());
};

export default { enhanceCaption };
