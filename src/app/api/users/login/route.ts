import { prisma } from "@/utils/db";
import { LoginUserDto } from "@/utils/dtos";
import { loginSchema } from "@/utils/validationSchemas";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { setCookie } from "@/utils/generateToken";

/**
 * @method POST
 * @route ~/api/users/login
 * @desc Login For User (Sign In) Authentication
 * @access public
 */

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as LoginUserDto;
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        {
          status: 400,
        }
      );
    }

    const user = await prisma.user.findUnique({ where: { email: body.email } });

    if (!user) {
      return NextResponse.json(
        {
          message: "Inavlid Email Or Password",
        },
        { status: 400 }
      );
    }
    const isPasswordMatch = await bcrypt.compare(body.password, user.password);

    if (!isPasswordMatch) {
      return NextResponse.json(
        { message: "Inavlid Email Or Password" },
        { status: 400 }
      );
    }

    const cookie = setCookie({
      id: user.id,
      isAdmin: user.isAdmin,
      username: user.username,
    });

    return NextResponse.json(
      { message: "Authenticated" },
      { status: 200, headers: { "Set-Cookie": cookie } }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error ! ", errorMessage: error },
      { status: 500 }
    );
  }
}
