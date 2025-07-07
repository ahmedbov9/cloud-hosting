"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { DOMIN } from "@/utils/constants";
import ButtonSpinner from "@/components/ButtonSpinner";

const LoginForm = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const formSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (email === "") return toast.error("Email Is Required");
    if (password === "") return toast.error("Password Is Required");

    try {
      setLoading(true);
      await axios.post(`${DOMIN}/api/users/login`, {
        email,
        password,
      });
      router.replace("/");
      router.refresh();
    } catch (error: any) {
      toast.error(error?.response?.data.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={formSubmitHandler} className="flex flex-col">
      <input
        className="mb-4 border rounded p-2 text-xl"
        type="email"
        placeholder="Enter Your Email ..."
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="mb-4 border rounded p-2 text-xl"
        type="password"
        placeholder="Enter Your password ..."
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        disabled={loading}
        type="submit"
        className="text-2xl text-white bg-blue-800 p-2 rounded-lg font-bold cursor-pointer"
      >
        {loading ? <ButtonSpinner /> : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;
