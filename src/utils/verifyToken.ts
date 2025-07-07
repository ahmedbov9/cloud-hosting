import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { JWTPayload } from "@/utils/types";
// Verify Token For Api End Points
export function verifyToken(req: NextRequest): JWTPayload | null {
  try {
    const jwtToken = req.cookies.get("jwtToken");
    const token = jwtToken?.value as string;
    if (!token) return null;
    const privteKey = process.env.JWT_SECRET as string;
    const userPayload = jwt.verify(token, privteKey) as JWTPayload;

    return userPayload;
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Verify Token For pages
export function verifyTokenForPage(token: string): JWTPayload | null {
  try {
    const privteKey = process.env.JWT_SECRET as string;
    const userPayload = jwt.verify(token, privteKey) as JWTPayload;
    if (!userPayload) return null;
    return userPayload;
  } catch (error) {
    console.log(error);
    return null;
  }
}
