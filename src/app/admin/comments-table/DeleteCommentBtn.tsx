"use client";

import { DOMIN } from "@/utils/constants";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface DeleteCommentBtnProps {
  commentId: number;
}
const DeleteCommentBtn = ({ commentId }: DeleteCommentBtnProps) => {
  const router = useRouter();

  const deleteCommentHandler = async () => {
    try {
      if (confirm("Are Sure To Delete comments " + commentId)) {
        await axios.delete(`${DOMIN}/api/comments/${commentId}`);
        router.refresh();
        toast.success("Comment Has Been Deleted Successfully");
      }
    } catch (error: any) {
      toast.error(error?.response?.data.message);
      console.log(error);
    }
  };

  return (
    <div
      className="bg-red-600 text-white rounded-lg inline-block py-1 px-2 cursor-pointer hover:bg-red-800 transition"
      onClick={deleteCommentHandler}
    >
      Delete
    </div>
  );
};

export default DeleteCommentBtn;
