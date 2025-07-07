import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";

/**
 * @method GET
 * @route -/api/articles/count
 * @desc Get Articles count
 * @access public
 */

export async function GET() {
  try {
    const count = await prisma.article.count();
    return NextResponse.json({ count }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", errorMessage: error },
      { status: 500 }
    );
  }
}
