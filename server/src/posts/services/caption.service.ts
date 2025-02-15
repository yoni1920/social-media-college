import { SchemaType } from "@google/generative-ai";
import { getGeminiModel } from "../../utils/ai-content";
import { EnhanceCaptionRequestDTO } from "../dto-schema/enhance-caption";
import { EnhanceOption } from "../types";
import { delay } from "../../utils/delay";

const model = getGeminiModel({
  description:
    "From provided user caption, your job is to either 'PARAPHRASE', 'CONCISE', or 'ELABORATE' the caption with the perspective as if you wrote the caption",
  type: SchemaType.OBJECT,
  properties: {
    status: {
      type: SchemaType.STRING,
      nullable: false,
      description: `Status 'SUCCESS' if successfully paraphrased, elaborated, or to concise the users caption, 'FAILED' if the user's caption did not provide enough information to concise, or any other failures`,
    },
    caption: {
      type: SchemaType.STRING,
      nullable: true,
      description: `User's caption to paraphrase, elaborate, or to concise, and translated to provided language if specified`,
    },
    reason: {
      type: SchemaType.STRING,
      nullable: true,
      description: `If Status is 'SUCCESS' should be null, if 'FAILED' then should provide reason`,
    },
  },
  required: ["status"],
});

const buildPrompt = ({
  enhanceOption,
  caption,
  translationLanguage,
}: EnhanceCaptionRequestDTO) => {
  if (enhanceOption === "CONCISE") {
    const prompt = `Make the following caption more concise without losing its original meaning and as if you wrote the caption. 
    caption: '${caption}'.`;

    return translationLanguage
      ? `${prompt} Second, translate the *concised* caption into ${translationLanguage.toLowerCase()} language. 
      Remember, the caption needs to be first concised then the caption needs to be translated to ${translationLanguage.toLowerCase()}`
      : prompt;
  }

  if (enhanceOption === "PARAPHRASE") {
    const prompt = `Paraphrase without losing its original meaning with the perspective as if you wrote the caption. 
    caption: '${caption}'.`;

    return translationLanguage
      ? `${prompt} Second, translate the *paraphrased* caption into ${translationLanguage.toLowerCase()} language.
       Remember, the caption needs to be first concised then the caption needs to be translated to ${translationLanguage.toLowerCase()}.`
      : prompt;
  }

  const prompt = `Slightly elaborate the following caption without losing its original meaning with the perspective as if you wrote the caption, and don't pass 2,000 characters.
    caption: '${caption}'.`;

  return translationLanguage
    ? `${prompt} Second, translate the *elaborated* caption into ${translationLanguage.toLowerCase()} language.
     Remember, the caption needs to be first concised then the caption needs to be translated to ${translationLanguage.toLowerCase()}`
    : prompt;
};

const enhanceCaption = async (enhanceRequest: EnhanceCaptionRequestDTO) => {
  const prompt = buildPrompt(enhanceRequest);

  await delay(2_000);
  const result = await model.generateContent(prompt);

  return JSON.parse(result.response.text());
};

export default { enhanceCaption };
