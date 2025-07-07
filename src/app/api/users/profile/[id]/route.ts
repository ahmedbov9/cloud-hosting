import { prisma } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

import { verifyToken } from "@/utils/verifyToken";
import { UpdateUserDto } from "@/utils/dtos";
import bcrypt from "bcryptjs";
import { updateUserSchema } from "@/utils/validationSchemas";
interface Props {
  params: Promise<{ id: string }>;
}

/**
 * @method DELETE
 * @route -/api/users/profile/:id
 * @desc Delete Profile
 * @access private ( Only User Him Self )
 */

export async function DELETE(req: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        comments: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User Not Found ! " },
        { status: 404 }
      );
    }

    const userFromToken = verifyToken(req);

    if (userFromToken !== null && userFromToken.id === user.id) {
      // deleting the user
      await prisma.user.delete({ where: { id: parseInt(id) } });
      // deleteing the comments that belong to this user
      const commentsIds = user.comments.map((comment) => comment.id);

      await prisma.comment.deleteMany({
        where: {
          id: { in: commentsIds },
        },
      });
      return NextResponse.json(
        {
          message: "Your Account Has Been Deleted Successfully",
        },
        { status: 200 }
      );
    }
    return NextResponse.json(
      {
        message: "You Are Not Allowed ! just only can user delete his account",
      },
      { status: 403 } // forbidden
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", errorMessage: error },
      { status: 500 }
    );
  }
}

/**
 * @method GET
 * @route -/api/users/profile/:id
 * @desc GET Profile By Id
 * @access private ( Only User Him Self )
 */

export async function GET(req: NextRequest, { params }: Props) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt((await params).id) },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        isAdmin: true,
      },
    });
    if (!user) {
      return NextResponse.json({ message: "user not found" }, { status: 404 });
    }

    const userFromToken = verifyToken(req);
    if (userFromToken === null || userFromToken.id !== user.id) {
      return NextResponse.json(
        { message: "Your Are Not Allowed , Access Denied" },
        { status: 403 }
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", errorMessage: error },
      { status: 500 }
    );
  }
}

/**
 * @method PUT
 * @route -/api/users/profile/:id
 * @desc Update Profile By Id
 * @access private ( Only User Him Self )
 */

export async function PUT(req: NextRequest, { params }: Props) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt((await params).id) },
    });

    const userFromToken = verifyToken(req);
    if (userFromToken === null || userFromToken.id !== user?.id) {
      return NextResponse.json(
        { message: "You Are Not Allowed , access denied" },
        { status: 403 }
      );
    }
    const body = (await req.json()) as UpdateUserDto;
    const validation = updateUserSchema.safeParse(body);
    if (validation.error) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      );
    }
    if (body.password) {
      const salt = await bcrypt.genSalt(10);
      body.password = await bcrypt.hash(body.password, salt);
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt((await params).id) },
      data: {
        username: body.username,
        email: body.email,
        password: body.password,
      },
    });
    const { password, ...other } = updatedUser;
    return NextResponse.json({ ...other }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", errorMessage: error },
      { status: 500 }
    );
  }
}
