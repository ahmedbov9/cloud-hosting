import { Article } from "@/generated/prisma";
import { DOMIN } from "@/utils/constants";
import { SingleArticle } from "@/utils/types";

// Get Article Base on PageNumber
export async function getArticles(
  pageNumber: string | undefined
): Promise<Article[]> {
  const response = await fetch(
    `${DOMIN}/api/articles?pageNumber=${pageNumber}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed To fetch Articles");
  }

  return response.json();
}
// Get Articles count
export async function getArticlesCount(): Promise<number> {
  const response = await fetch(`${DOMIN}/api/articles/count`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed To Get Articles Count");
  }

  const { count } = (await response.json()) as { count: number };
  return count;
}

// Get Article Base on Search Text
export async function getArticlesBasedOnSearch(
  searchText: string | string[] | undefined
): Promise<Article[]> {
  const response = await fetch(
    `${DOMIN}/api/articles/search?searchText=${searchText}`,
    {
      next: { revalidate: 50 },
    }
  );

  if (!response.ok) {
    throw new Error("Failed To fetch Articles");
  }

  return response.json();
}

// get Single Article By Id

export async function getSingleArticle(
  articleId: string
): Promise<SingleArticle> {
  const response = await fetch(`${DOMIN}/api/articles/${articleId}`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Failed To Fetch Article !");
  }
  return response.json();
}
