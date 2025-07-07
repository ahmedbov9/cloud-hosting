import { getSingleArticle } from "@/apiCalls/articleApiCall";
import { Article } from "@/generated/prisma";
import { verifyTokenForPage } from "@/utils/verifyToken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import EditArticleForm from "./EditArticleForm";

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

const EditArticlePage = async ({ params }: EditArticlePageProps) => {
  const cookieStorage = await cookies();

  const token = cookieStorage.get("jwtToken")?.value;
  if (!token) redirect("/");

  const payload = verifyTokenForPage(token);
  if (payload?.isAdmin === false) redirect("/");

  const id = (await params).id;

  const article: Article = await getSingleArticle(id);

  return (
    <section className="fix-height flex items-center justify-center px-5 lg:px-20">
      <div className="shadow p-4 bg-purple-200 rounded w-full">
        <h2 className="text-2xl text-green-700 font-semibold mb-4">
          Edit Article
        </h2>
        <EditArticleForm article={article} />
      </div>
    </section>
  );
};

export default EditArticlePage;
