import { z } from "zod";

// Create Article Validation Schema
export const createArticleSchema = z.object({
  title: z
    .string({
      required_error: "Title Is Required !",
      invalid_type_error: "Title Most Be a String !",
    })
    .min(2, {
      message: "Title Should Be at Least 2 Characters Long !",
    })
    .max(200, { message: "Title Should Be Less Than 200 Characters !" }),
  description: z.string().min(10),
});

// Register User Validation Schema
export const registerSchema = z.object({
  username: z.string().min(2).max(100),
  email: z.string().min(3).max(200).email(),
  password: z.string().min(6),
});
// Login User Validation Schema
export const loginSchema = z.object({
  email: z.string().min(3).max(200).email(),
  password: z.string().min(6),
});

// create comment schema

export const createCommentSchema = z.object({
  text: z.string().min(2).max(500),
  articleId: z.number(),
});

// Update User Profile Validation Schema
export const updateUserSchema = z.object({
  username: z.string().min(2).max(100).optional(),
  email: z.string().min(3).max(200).email().optional(),
  password: z.string().min(6).optional(),
});
