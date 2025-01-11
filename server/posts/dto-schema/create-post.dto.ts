import { z } from "zod";

/**
 * @swagger
 * components:
 *   schemas:
 *     CreatePostDTO:
 *       type: object
 *       required:
 *         - sender
 *       properties:
 *         id:
 *           type: string
 *           required: false
 *         sender:
 *           type: string
 *           required: true
 *         message:
 *           type: string
 *           required: true
 */
export const createPostSchema = z.strictObject({
  id: z.string().optional(),
  sender: z.string().min(1),
  message: z.string().default(""),
});

export type CreatePostDTO = z.infer<typeof createPostSchema>;
