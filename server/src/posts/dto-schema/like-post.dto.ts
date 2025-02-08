import { z } from "zod";

export enum LikeMethod {
  LIKE = "LIKE",
  DISLIKE = "DISLIKE",
}

/**
 * @swagger
 * components:
 *   schemas:
 *     LikePostDTO:
 *       type: object
 *       required:
 *         - post
 *         - user
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
export const likePostSchema = z.strictObject({
  user: z.string().min(1),
  method: z.nativeEnum(LikeMethod),
});

export type LikePostDTO = z.infer<typeof likePostSchema>;
