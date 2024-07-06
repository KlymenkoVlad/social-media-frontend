"use client";

import { stringCut } from "@/utils/stringCut";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import { MdClear, MdSearch } from "react-icons/md";
import { z } from "zod";

const FormSchema = z.object({
  text: z.string().min(1, "Text is required"),
});

type Inputs = z.infer<typeof FormSchema>;

const SearchForm = () => {
  const { register, handleSubmit, reset, watch } = useForm<Inputs>({
    resolver: zodResolver(FormSchema),
  });

  const text = watch("text");
  return (
    <form
      onSubmit={(e) => handleSubmit(() => e.preventDefault())()}
      className="relative flex h-10 w-full max-w-96"
    >
      <MdSearch className="absolute left-2 top-2 z-0 text-2xl text-gray-500" />
      <MdClear
        className="absolute right-2 top-2 z-0 cursor-pointer text-2xl text-gray-500 transition-colors hover:text-red-500"
        onClick={() => reset()}
      />
      <input
        className="w-full rounded-lg bg-gray-100 p-4 pe-10 ps-10 text-base transition-colors ease-in-out hover:bg-gray-200 focus:bg-gray-200 focus:outline-none"
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
  );
};

export default SearchForm;
