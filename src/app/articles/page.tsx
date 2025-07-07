import { getArticles, getArticlesCount } from "@/apiCalls/articleApiCall";
import ArticleItem from "@/components/articles/ArticleItem";
import Pagination from "@/components/articles/Pagination";
import SearchArticleInput from "@/components/articles/SearchArticleInput";
import { Article } from "@/generated/prisma";
import { ARTICLE_PER_PAGE } from "@/utils/constants";
import { Metadata } from "next";

interface ArticlePageProps {
  searchParams: Promise<{ pageNumber: string }>;
}

const ArticlesPage = async ({ searchParams }: ArticlePageProps) => {
  const pageNumber = (await searchParams).pageNumber;

  const articles: Article[] = await getArticles(pageNumber);
  const count: number = await getArticlesCount();

  const pages = Math.ceil(count / ARTICLE_PER_PAGE);

  return (
    <section className="container m-auto px-5">
      <SearchArticleInput />
      <div className="flex items-center justify-center flex-wrap gap-7">
        {articles.map((item) => (
          <ArticleItem article={item} key={item.id} />
        ))}
      </div>
      <Pagination
        pageNumber={parseInt(pageNumber)}
        route="/articles"
        pages={pages}
      />
    </section>
  );
};

export default ArticlesPage;

export const metadata: Metadata = {
  title: "Article Page",
  description: "Articles About Programming",
};
