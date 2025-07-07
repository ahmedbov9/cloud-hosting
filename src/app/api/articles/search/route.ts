import { prisma } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

/**
 * @method GET
 * @route -/api/articles/search?searchText=[value]
 * @desc Get Articles By Search Text
 * @access public
 */

export async function GET(req: NextRequest) {
  try {
    const searchText = req.nextUrl.searchParams.get("searchText");
    let articles;
    if (searchText) {
      articles = await prisma.article.findMany({
        where: {
          title: {
            startsWith: searchText,
            mode: "insensitive",
          },
        },
      });
    } else {
      articles = await prisma.article.findMany({ take: 6 });
    }
    return NextResponse.json(articles, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", errorMessage: error },
      { status: 500 }
    );
  }
}
