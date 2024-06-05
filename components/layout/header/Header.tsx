"use client";

import React, { useState } from "react";
import {
  Search,
  KeyboardArrowDown,
  Clear,
  Settings,
  Logout,
  HelpOutline,
  Notifications,
} from "@mui/icons-material";
import Logo from "../../common/Logo";
import BlankAvatar from "@/components/common/BlankAvatar";
import Link from "next/link";
import cookies from "js-cookie";
import { redirect } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const FormSchema = z.object({
  text: z.string().min(1, "Text is required"),
});

type Inputs = z.infer<typeof FormSchema>;

const Header = () => {
  const [showModal, setShowModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<Inputs>({
    resolver: zodResolver(FormSchema),
  });

  // const processForm = async (data: Inputs) => {};

  const trunculateString = (str: string, maxLength = 20) => {
    if (str && str.length > maxLength) {
      return str.slice(0, maxLength) + "...";
    }
    return str;
  };

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
            Find <span className="font-bold">{trunculateString(text, 26)}</span>{" "}
            in <span className="font-bold">posts</span>
          </Link>
          <Link
            className="block h-12 rounded-md p-2 transition-colors hover:bg-gray-200"
            href={`/search/users/${text}`}
            onClick={() => reset()}
          >
            Find <span className="font-bold">{trunculateString(text, 26)}</span>{" "}
            in <span className="font-bold">users</span>
          </Link>
        </div>
      </form>

      <div className="flex h-full items-center space-x-3">
        <div className="flex h-full w-12 cursor-pointer items-center justify-center transition-colors hover:bg-gray-300">
          <Notifications />
        </div>
        <div
          onClick={() => setShowModal(!showModal)}
          className="flex h-full w-24 cursor-pointer items-center justify-center transition-colors hover:bg-gray-300"
        >
          <BlankAvatar />
          <KeyboardArrowDown
            className={` ${
              showModal ? "rotate-180 text-gray-500" : "text-gray-400"
            }`}
          />
        </div>
      </div>

      <div
        className={`absolute right-[160px] top-16 z-10 h-[300px] w-[250px] transform space-y-6 rounded-md bg-white shadow-md transition-opacity duration-300 ease-in-out ${
          showModal ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex w-full items-center p-3">
          <BlankAvatar imageSrc="" />
          <div className="ml-3">
            <p className="">name</p>
            <p className="text-xs text-gray-400">username</p>
          </div>
        </div>

        <Link
          className="flex w-full items-center p-3 transition-colors hover:bg-gray-200"
          href={"/my-profile/settings"}
        >
          <Settings />
          <p className="ml-2">Settings</p>
        </Link>
        <Link
          className="flex w-full items-center p-3 transition-colors hover:bg-gray-200"
          href={"/my-profile/help"}
        >
          <HelpOutline />
          <p className="ml-2">Help</p>
        </Link>
        <button
          onClick={() => {
            cookies.remove("token");
            redirect("/signin");
          }}
          className="flex w-full items-center p-3 transition-colors hover:bg-gray-200"
        >
          <Logout />
          <p className="ml-2">Sign out</p>
        </button>
      </div>
    </header>
  );
};

export default Header;
