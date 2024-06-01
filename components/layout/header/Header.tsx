"use client";

import React, { useState } from "react";
import {
  Search,
  KeyboardArrowDown,
  Clear,
  Settings,
  Logout,
  HelpOutline,
} from "@mui/icons-material";
import Logo from "../../common/Logo";
import BlankAvatar from "@/components/common/BlankAvatar";
import Link from "next/link";
import cookies from "js-cookie";
import { redirect } from "next/navigation";
const Header = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <header className="relative h-14 shadow-md flex justify-around items-center bg-gray-50">
      <Link href={"/feed"} className="flex items-center">
        <Logo />
        <h1 className="ml-2 text-2xl font-bold">ewmedia</h1>
      </Link>

      <div className="relative w-60 h-8 flex ">
        <Search className="w-4 h-4 text-gray-500 absolute z-0 top-2 left-2" />
        <Clear className="w-4 h-4 text-gray-500 absolute z-0 top-2 right-2" />
        <input
          className="text-sm p-4 focus:outline-none ps-10 w-full rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors ease-in-out"
          type="text"
          placeholder="Search"
        />
      </div>

      <div
        onClick={() => setShowModal(!showModal)}
        className="hover:bg-gray-300 h-full w-24 flex justify-center items-center cursor-pointer transition-colors"
      >
        <BlankAvatar />
        <KeyboardArrowDown
          className={` ${
            showModal ? "rotate-180 text-gray-500" : "text-gray-400"
          }`}
        />
      </div>

      <div
        className={`space-y-6  absolute right-[160px] z-10 top-16 w-[250px] h-[300px] bg-white rounded-md shadow-md transform transition-opacity duration-300 ease-in-out ${
          showModal ? "opacity-100 " : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="p-3 flex items-center w-full ">
          <BlankAvatar />
          <div className="ml-3">
            <p className="">name</p>
            <p className=" text-xs text-gray-400">username</p>
          </div>
        </div>

        <Link
          className="p-3 flex items-center w-full transition-colors hover:bg-gray-200 "
          href={"/my-profile/settings"}
        >
          <Settings />
          <p className="ml-2">Settings</p>
        </Link>
        <Link
          className="p-3 flex items-center w-full transition-colors hover:bg-gray-200 "
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
          className="p-3 flex items-center w-full transition-colors hover:bg-gray-200 "
        >
          <Logout />
          <p className="ml-2">Sign out</p>
        </button>
      </div>
    </header>
  );
};

export default Header;
