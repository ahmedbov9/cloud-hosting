"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import { DOMIN } from "@/utils/constants";

const LogoutButton = () => {
  const router = useRouter();

  const logoutHandler = async () => {
    try {
      await axios.get(`${DOMIN}/api/users/logout`);
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.warning("Something went wrong");
      console.log(error);
    }
  };

  return (
    <button
      onClick={logoutHandler}
      className="bg-gray-700 text-gray-200 px-1 rounded cursor-pointer"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
