import { z } from "zod";

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdatePostDTO:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           required: false
 *         fileName:
 *           type: string
 *           required: false
 */
export const updatePostSchema = z.strictObject({
  message: z.string().optional(),
  fileName: z.string().optional(),
});

export type UpdatePostDTO = z.infer<typeof updatePostSchema>;
