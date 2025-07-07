import { prisma } from "@/utils/db";
import { RegisterUserDto } from "@/utils/dtos";
import { setCookie } from "@/utils/generateToken";
import { registerSchema } from "@/utils/validationSchemas";
import bcrypt from "bcryptjs";
import { NextResponse, NextRequest } from "next/server";

/**
 * @method POST
 * @route ~/api/users/register
 * @desc Create New User By User (Sign Up)
 * @access public
 */

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RegisterUserDto;
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      );
    }
    const user = await prisma.user.findUnique({
      where: { email: body.email },
    });
    if (user) {
      return NextResponse.json(
        { message: "Email Already Exist !" },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);

    const newUser = await prisma.user.create({
      data: {
        username: body.username,
        email: body.email,
        password: hashedPassword,
      },
      select: {
        username: true,
        id: true,
        isAdmin: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const cookie = setCookie({
      id: newUser.id,
      username: newUser.username,
      isAdmin: newUser.isAdmin,
    });

    return NextResponse.json(
      { ...newUser, message: "Registered And Authenticated" },
      {
        status: 201,
        headers: {
          "Set-Cookie": cookie,
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error ! ", errorMessage: error },
      { status: 500 }
    );
  }
}
