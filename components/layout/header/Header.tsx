import React from "react";
import Logo from "../../Logo";
import Link from "next/link";

import Modals from "./Modals";
import SearchForm from "./SearchForm";
import { getMe } from "@/app/_actions";

const Header = async () => {
  const user = await getMe();

  return (
    <header className="relative flex h-14 items-center justify-around bg-gray-50 shadow-md">
      <Link href={"/feed"} className="flex items-center">
        <Logo />
        <h1 className="ml-2 text-2xl font-bold">ewmedia</h1>
      </Link>

      <SearchForm />

      <Modals user={user} />
    </header>
  );
};

export default Header;
