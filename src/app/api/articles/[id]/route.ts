import { UpdateArticleDto } from "@/utils/dtos";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/db";
import { verifyToken } from "@/utils/verifyToken";

interface Props {
  params: Promise<{ id: string }>;
}

/**
 * @method GET
 * @route -/api/articles/:id
 * @desc Get Single Article By Id
 * @access public
 */

export async function GET(req: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const article = await prisma.article.findUnique({
      where: { id: parseInt(id) },
      include: {
        comments: {
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: { username: true },
            },
          },
        },
      },
    });
    if (!article) {
      return NextResponse.json(
        { message: "Article Not Found !" },
        { status: 404 }
      );
    }
    return NextResponse.json(article, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", errorMessage: error },
      { status: 500 }
    );
  }
}

/**
 * @method PUT
 * @route -/api/articles/:id
 * @desc Update Article By Id
 * @access private ( Only Admin Can Modify The Article )
 */

export async function PUT(req: NextRequest, { params }: Props) {
  try {
    const user = verifyToken(req);

    if (user === null || user.isAdmin === false) {
      return NextResponse.json(
        { message: "You Are Not Allowed , Access Deneid" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const article = await prisma.article.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (!article) {
      return NextResponse.json(
        { message: "Article Not Found !" },
        { status: 404 }
      );
    }

    const body = (await req.json()) as UpdateArticleDto;
    const updatedArticle = await prisma.article.update({
      where: { id: parseInt(id) },
      data: {
        title: body.title,
        description: body.description,
      },
    });
    return NextResponse.json(updatedArticle, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal Server Error !",
        errorMessage: error,
      },
      { status: 500 }
    );
  }
}
/**
 * @method DELETE
 * @route -/api/articles/:id
 * @desc Delete Article By Id
 * @access private ( Only Admin Can Delete )
 */

export async function DELETE(req: NextRequest, { params }: Props) {
  try {
    const user = verifyToken(req);

    if (user === null || user.isAdmin === false) {
      return NextResponse.json(
        { message: "You Are Not Allowed , Access Deneid" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const article = await prisma.article.findUnique({
      where: { id: parseInt(id) },
      include: { comments: true },
    });

    if (!article) {
      return NextResponse.json(
        { message: "Article Not Found !" },
        { status: 404 }
      );
    }
    // deleteing article
    await prisma.article.delete({ where: { id: parseInt(id) } });

    //  deleting the comment that belong to this article

    const commentsIds: number[] = article?.comments.map(
      (comment) => comment.id
    );

    await prisma.comment.deleteMany({
      where: { id: { in: commentsIds } },
    });

    return NextResponse.json({ message: "article Deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal Server Error !",
        errorMessage: error,
      },
      { status: 500 }
    );
  }
}
