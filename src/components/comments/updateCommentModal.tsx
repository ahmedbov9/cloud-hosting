"use client";

import { DOMIN } from "@/utils/constants";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Dispatch, FormEvent, useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { toast } from "react-toastify";

interface UpdateCommentModalProps {
  setOpen: Dispatch<React.SetStateAction<boolean>>;
  text: string;
  commentId: number;
}

const UpdateCommentModal = ({
  setOpen,
  text,
  commentId,
}: UpdateCommentModalProps) => {
  const [updatedText, setUpdatedText] = useState(text);
  const router = useRouter();
  const formSubmitHandler = async (e: FormEvent) => {
    e.preventDefault();
    if (updatedText === "")
      return toast.info("Invalid Comment Please Fill The Feild !");
    try {
      await axios.put(`${DOMIN}/api/comments/${commentId}`, {
        text: updatedText,
      });
      router.refresh();
      setUpdatedText("");
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.response?.data.message);
      console.log(error);
    }
  };
  return (
    <div className="fixed top-0 left-0 bottom-0 right-0 z-10 bg-black/50 bg-opacity-40 flex items-center justify-center">
      <div className="w-11/12 lg:w-2/4  bg-white rounded-lg p-3">
        <div className="flex justify-end items-center mb-5">
          <IoMdCloseCircleOutline
            className="text-red-500 cursor-pointer text-3xl"
            onClick={() => setOpen(false)}
          />
        </div>
        <form onSubmit={formSubmitHandler}>
          <input
            type="text"
            placeholder="Edit Comment..."
            value={updatedText}
            onChange={(e) => setUpdatedText(e.target.value)}
            className="text-xl rounded-lg p-2 w-full bg-white mb-2 shadow-black drop-shadow-2xl"
          />
          <button
            type="submit"
            className="bg-green-700 w-full text-white mt-2 p-1 text-xl rounded-lg hover:bg-green-900 transition"
          >
            Edit
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateCommentModal;
