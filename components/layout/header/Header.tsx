"use client";

import React from "react";
import { Search, Clear } from "@mui/icons-material";
import Logo from "../../Logo";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { stringCut } from "@/utils/stringCut";
import Modals from "./Modals";

const FormSchema = z.object({
  text: z.string().min(1, "Text is required"),
});

type Inputs = z.infer<typeof FormSchema>;

const Header = () => {
  const { register, handleSubmit, reset, watch } = useForm<Inputs>({
    resolver: zodResolver(FormSchema),
  });

  const text = watch("text");

  return (
    <header className="relative flex h-14 items-center justify-around bg-gray-50 shadow-md">
      <Link href={"/feed"} className="flex items-center">
        <Logo />
        <h1 className="ml-2 text-2xl font-bold">ewmedia</h1>
      </Link>

      <form
        onSubmit={(e) => handleSubmit(() => e.preventDefault())()}
        className="relative flex h-8 w-96"
      >
        <Search className="absolute left-2 top-2 z-0 h-4 w-4 text-gray-500" />
        <Clear className="absolute right-2 top-2 z-0 h-4 w-4 text-gray-500" />
        <input
          className="w-full rounded-lg bg-gray-100 p-4 ps-10 text-sm transition-colors ease-in-out hover:bg-gray-200 focus:bg-gray-200 focus:outline-none"
          type="text"
          placeholder="Search"
          {...register("text")}
        />

        <div
          className={`absolute left-0 top-12 z-30 w-full transform space-y-5 overflow-hidden rounded-md bg-white p-3 shadow-md transition-opacity duration-300 ease-in-out ${
            text ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <Link
            className="block h-12 rounded-md p-2 transition-colors hover:bg-gray-200"
            href={`/search/posts/${text}`}
            onClick={() => reset()}
          >
            Find <span className="font-bold">{stringCut(text, 26)}</span> in{" "}
            <span className="font-bold">posts</span>
          </Link>
          <Link
            className="block h-12 rounded-md p-2 transition-colors hover:bg-gray-200"
            href={`/search/users/${text}`}
            onClick={() => reset()}
          >
            Find <span className="font-bold">{stringCut(text, 26)}</span> in{" "}
            <span className="font-bold">users</span>
          </Link>
        </div>
      </form>

      <Modals />
    </header>
  );
};

export default Header;
