"use client";

import { DOMIN } from "@/utils/constants";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const AddArticleForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();
  const formSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title === "") return toast.error("Title Is Required");
    if (description === "") return toast.error("Description Is Required");
    try {
      await axios.post(`${DOMIN}/api/articles`, { title, description });
      setTitle("");
      setDescription("");
      toast.success("Article Has Been Added Successfully");
      router.refresh();
    } catch (error: any) {
      toast.error(error?.response?.data.message);
      console.log(error);
    }
  };

  return (
    <form onSubmit={formSubmitHandler} className="flex flex-col">
      <input
        className="mb-4  rounded p-2 text-xl bg-white outline-none"
        type="text"
        placeholder="Enter Article Title ..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="mb-4 p-2 lg:text-xl rounded resize-none bg-white outline-none"
        rows={5}
        placeholder="Enter Article Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button
        type="submit"
        className="text-2xl text-white bg-blue-700 p-2 hover:bg-blue-900 rounded-lg font-bold cursor-pointer transition-all"
      >
        Add
      </button>
    </form>
  );
};

export default AddArticleForm;
