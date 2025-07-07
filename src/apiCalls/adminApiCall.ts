import { Comment } from "@/generated/prisma";
import { DOMIN } from "@/utils/constants";

// Get All Comments
export async function getAllComments(token: string): Promise<Comment[]> {
  const response = await fetch(`${DOMIN}/api/comments`, {
    headers: {
      Cookie: `jwtToken=${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed To Fetch Comments ! ");
  return response.json();
}
