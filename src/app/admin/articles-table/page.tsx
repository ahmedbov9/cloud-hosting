import { verifyTokenForPage } from "@/utils/verifyToken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ARTICLE_PER_PAGE } from "@/utils/constants";
import { Article } from "@/generated/prisma";
import Link from "next/link";
import { getArticles, getArticlesCount } from "@/apiCalls/articleApiCall";
import Pagination from "@/components/articles/Pagination";
import DeleteArticleBtn from "./DeleteArticleBtn";

interface AdminArticlesTableProps {
  searchParams: Promise<{ pageNumber: string }>;
}
const AdminArticlesTable = async ({
  searchParams,
}: AdminArticlesTableProps) => {
  const pageNumber = (await searchParams).pageNumber;
  const cookieStorage = await cookies();
  const token = cookieStorage.get("jwtToken")?.value;
  if (!token) redirect("/");
  const payload = verifyTokenForPage(token);
  if (payload?.isAdmin === false) redirect("/");

  const articles: Article[] = await getArticles(pageNumber);
  const count: number = await getArticlesCount();
  const pages = Math.ceil(count / ARTICLE_PER_PAGE);
  return (
    <section className="p-5">
      <h1 className="mb-7 text-2xl font-semibold text-gray-700">Articles</h1>
      <table className="table w-full text-left">
        <thead className="border-t-2 border-b-2 border-gray-500 lg:text-xl">
          <tr>
            <th className="p-1 lg:-2">Title</th>
            <th className="hidden lg:inline-block">Created At</th>
            <th>Actions</th>
            <th className="hidden lg:inline-block"></th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => (
            <tr key={article.id} className="border-b border-t border-gray-300">
              <td className="p-3 text-gray-700" title={article.title}>
                {article.title}
              </td>
              <td className="hidden lg:inline-block text-gray-700 font-normal p-3">
                {new Date(article.createdAt).toDateString()}
              </td>
              <td className="p-3">
                <Link
                  href={`/admin/articles-table/edit/${article.id}`}
                  className="bg-green-600 text-white rounded-lg py-1 px-2 inline-block text-center mb-2 me-2 lg:me-3 hover:bg-green-800 transition"
                >
                  Edit
                </Link>
                <DeleteArticleBtn articleId={article.id} />
              </td>
              <td className="hidden lg:inline-block p-3">
                <Link
                  className="text-white bg-blue-600 rounded-lg p-2 hover:bg-blue-800"
                  href={`/articles/${article.id}`}
                >
                  Read More
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        pageNumber={parseInt(pageNumber)}
        pages={pages}
        route={"/admin/articles-table"}
      />
    </section>
  );
};

export default AdminArticlesTable;
