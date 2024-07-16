import React from "react";
import Logo from "../../ui/Logo";
import Link from "next/link";

import Modals from "./Modals";
import SearchForm from "./SearchForm";
import { getMe } from "@/actions/user";

const Header = async () => {
  const user = await getMe();

  return (
    <header className="flex h-14 w-full items-center justify-around bg-gray-50 shadow-md">
      <div className="relative flex h-full w-[1150px] items-center justify-between">
        <Link
          href={"/feed"}
          className="ml-2 mr-10 hidden w-fit items-center sm:flex"
        >
          <Logo />
          <h1 className="ml-2 text-2xl font-bold">ewmedia</h1>
        </Link>

        <SearchForm />

        <Modals user={user} />
      </div>
    </header>
  );
};

export default Header;
