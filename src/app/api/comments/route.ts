import { CreateCommentDto } from "@/utils/dtos";
import { createCommentSchema } from "@/utils/validationSchemas";
import { verifyToken } from "@/utils/verifyToken";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/db";

/**
 * @method POST
 * @route -/api/comments
 * @desc Create New Comments
 * @access private ( Only Log in users ! )
 */
export async function POST(req: NextRequest) {
  try {
    const user = verifyToken(req);
    if (!user) {
      return NextResponse.json(
        { message: "Only Logged in users , access denied" },
        { status: 401 }
      );
    }
    const body = (await req.json()) as CreateCommentDto;

    const validation = createCommentSchema.safeParse(body);

    if (validation.error) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      );
    }
    const newComment = await prisma.comment.create({
      data: {
        text: body.text,
        articleId: body.articleId,
        userId: user.id,
      },
    });
    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", errorMessage: error },
      { status: 500 }
    );
  }
}

/**
 * @method GET
 * @route -/api/comments
 * @desc Get All Comments
 * @access private ( Only Admin)
 */
export async function GET(req: NextRequest) {
  try {
    const user = verifyToken(req);
    if (user === null || !user.isAdmin) {
      return NextResponse.json(
        { message: "only admin , access denied" },
        { status: 403 }
      );
    }
    const comments = await prisma.comment.findMany();
    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", errorMessage: error },
      { status: 500 }
    );
  }
}
