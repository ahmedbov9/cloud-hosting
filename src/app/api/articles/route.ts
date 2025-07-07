import { Article } from "@/generated/prisma";
import { CreateArticleDto } from "@/utils/dtos";
import { createArticleSchema } from "@/utils/validationSchemas";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/db";
import { ARTICLE_PER_PAGE } from "@/utils/constants";
import { verifyToken } from "@/utils/verifyToken";

/**
 * @method GET
 * @route -/api/articles
 * @desc Get Articles By Page Number
 * @access public
 */

export async function GET(req: NextRequest) {
  try {
    const pageNumber = req.nextUrl.searchParams.get("pageNumber") || "1";

    const articles = await prisma.article.findMany({
      skip: ARTICLE_PER_PAGE * (parseInt(pageNumber) - 1), // = 0
      take: ARTICLE_PER_PAGE,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(articles, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", errorMessage: error },
      { status: 500 }
    );
  }
}

/**
 * @method POST
 * @route -/api/articles
 * @desc Create New Article
 * @access private (Only Admin Can Create Article)
 */

export async function POST(req: NextRequest) {
  try {
    const user = verifyToken(req);

    if (user === null || user.isAdmin === false) {
      return NextResponse.json(
        { message: "Only Admin , Access Denied" },
        { status: 403 }
      );
    }

    const body = (await req.json()) as CreateArticleDto;

    const validation = createArticleSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      );
    }
    const newArticle: Article = await prisma.article.create({
      data: {
        title: body.title,
        description: body.description,
      },
    });

    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", errorMessage: error },
      { status: 500 }
    );
  }
}
