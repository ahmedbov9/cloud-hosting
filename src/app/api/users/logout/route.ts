import { cookies } from "next/headers";
import {  NextResponse } from "next/server";

/**
 * @method POST
 * @route ~/api/users/logout
 * @desc logout For User (Sign Out)
 * @access public
 */

export async function GET() {
  try {
    (await cookies()).delete("jwtToken");
    return NextResponse.json({ message: "LogedOut" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error ! ", errorMessage: error },
      { status: 500 }
    );
  }
}
