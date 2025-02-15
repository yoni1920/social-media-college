import { translationLanguages } from "../../types";
import { enhanceOptions } from "../../types/enhance-option";
import { z } from "zod";

/**
 * @swagger
 * components:
 *   schemas:
 *     EnhanceCaptionRequestDTO:
 *       type: object
 *       required:
 *         - userID
 *         - caption
 *         - enhanceOption
 *       properties:
 *         userID:
 *           type: string
 *           required: true
 *         caption:
 *           type: string
 *           required: true
 *         enhanceOption:
 *           type: string
 *           required: true
 *         translationLanguage:
 *           type: string
 *           required: false
 */
export const enhanceCaptionRequestSchema = z.strictObject({
  userID: z.string().min(1),
  caption: z.string().min(1),
  enhanceOption: z.enum(enhanceOptions),
  translationLanguage: z.enum(translationLanguages).optional(),
});

export type EnhanceCaptionRequestDTO = z.infer<
  typeof enhanceCaptionRequestSchema
>;
