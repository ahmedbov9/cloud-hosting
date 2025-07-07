import { prisma } from "@/utils/db";
import { UpdateCommentDto } from "@/utils/dtos";
import { verifyToken } from "@/utils/verifyToken";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: Promise<{ id: string }>;
}

/**
 * @method PUT
 * @route -/api/comments/:id
 * @desc Update Comment
 * @access private ( Only Owner of this Comment ! )
 */

export async function PUT(req: NextRequest, { params }: Props) {
  try {
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt((await params).id) },
    });
    if (!comment)
      return NextResponse.json(
        { message: "Comment Is Not Exist !" },
        { status: 404 }
      );
    const user = verifyToken(req);
    if (user === null || user.id !== comment.userId) {
      return NextResponse.json(
        { message: "You are Not Allowed , Access Denied" },
        { status: 403 }
      );
    }
    const body = (await req.json()) as UpdateCommentDto;
    const updatedComment = await prisma.comment.update({
      where: { id: parseInt((await params).id) },
      data: {
        text: body.text,
      },
    });

    return NextResponse.json(updatedComment, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", errorMessage: error },
      { status: 500 }
    );
  }
}

/**
 * @method DELETE
 * @route -/api/comments/:id
 * @desc DELETE Comment
 * @access private ( Only Admin Or Owner of the comment ! )
 */

export async function DELETE(req: NextRequest, { params }: Props) {
  try {
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt((await params).id) },
    });
    if (!comment)
      return NextResponse.json(
        { message: "Comment Is Not Exist !" },
        { status: 404 }
      );
    const user = verifyToken(req);
    if (user === null) {
      return NextResponse.json(
        { message: "No Token Provided , access denied" },
        { status: 401 }
      );
    }

    if (user.isAdmin || user.id === comment.userId) {
      await prisma.comment.delete({
        where: { id: parseInt((await params).id) },
      });
      return NextResponse.json({
        message: "The Comment Has Been Deleted Successfully",
      });
    }
    return NextResponse.json(
      { message: "You're not Alowed , access denied" },
      { status: 403 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", errorMessage: error },
      { status: 500 }
    );
  }
}
