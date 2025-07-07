"use client";
import { DOMIN } from "@/utils/constants";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";

interface DeleteArticleBtnProps {
  articleId: number;
}

const DeleteArticleBtn = ({ articleId }: DeleteArticleBtnProps) => {
  const router = useRouter();

  const deleteArticleHandler = async () => {
    try {
      if (confirm("Are You Sure To Delete that ?")) {
        await axios.delete(`${DOMIN}/api/articles/${articleId}`);
        router.refresh();
        toast.success("Article Has Been Deleted Successfully");
      }
    } catch (error: any) {
      toast.error(error?.response?.data.message);
    }
  };
  return (
    <div
      onClick={deleteArticleHandler}
      className="bg-red-600 text-white rounded-lg cursor-pointer inline-block text-center py-1 px-2 hover:bg-red-800 transition"
    >
      Delete
    </div>
  );
};

export default DeleteArticleBtn;
