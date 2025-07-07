import { getArticlesBasedOnSearch } from "@/apiCalls/articleApiCall";
import ArticleItem from "@/components/articles/ArticleItem";
import { Article } from "@/generated/prisma";
import React from "react";

interface SearchAtriclePageProps {
  searchParams: Promise<{ searchText: string | string[] }>;
}

const SearchAtriclePage = async ({ searchParams }: SearchAtriclePageProps) => {
  const { searchText } = await searchParams;

  const articles: Article[] = await getArticlesBasedOnSearch(searchText);
  return (
    <section className="fix-height container m-auto px-5">
      {articles.length === 0 ? (
        <h2 className="text-gray-800 text-2xl font-bold p-5">
          Articles Based On
          <span className="text-red-500 mx-1">{searchText}</span>
          Not Found
        </h2>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-2 mt-7 text-gray-800">
            Articles Based on
            <span className="ms-1 text-green-700 text-3xl font-bold">
              {searchText}
            </span>
          </h1>
          <div className="flex items-center justify-center flex-wrap gap-7">
            {articles.map((item) => (
              <ArticleItem key={item.id} article={item} />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default SearchAtriclePage;
