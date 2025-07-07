import jwt from "jsonwebtoken";
import { JWTPayload } from "./types";
import { serialize } from "cookie";

// Generate Token
export function generateJWT(jwtPayload: JWTPayload): string {
  const privteKey = process.env.JWT_SECRET;
  const token = jwt.sign(jwtPayload, privteKey as string, {
    expiresIn: "30d",
  });
  return token;
}

// Set Cookie with JWT

export function setCookie(jwtPayload: JWTPayload): string {
  const token = generateJWT(jwtPayload);

  const cookie = serialize("jwtToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return cookie;
}
