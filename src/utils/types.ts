import { Article, Comment, User } from "@/generated/prisma";
export type JWTPayload = {
  id: number;
  isAdmin: boolean;
  username: string;
};

export type CommentWithUser = Comment & { user: User };
export type SingleArticle = Article & { comments: CommentWithUser[] };
