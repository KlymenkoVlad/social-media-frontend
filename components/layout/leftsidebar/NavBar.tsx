"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  MdOutlineAccountCircle,
  MdOutlineGroups,
  MdOutlinePeopleAlt,
} from "react-icons/md";

const NavBar = () => {
  const [id, setId] = useState<string | null>(null);

  const navLinkStyle =
    "flex items-center justify-start hover:bg-gray-200 cursor-pointer transition-colors ease-in-out h-12 rounded-md w-full";

  useEffect(() => {
    setId(localStorage.getItem("userId"));
  }, []);
  return (
    <nav className="min-w-48 space-y-6">
      <Link href={`/profile/${id}`} className={navLinkStyle}>
        <MdOutlineAccountCircle className="ml-2" />
        <span className="ml-2">My Profile</span>
      </Link>
      <Link href={`/friends/${id}`} className={navLinkStyle}>
        <MdOutlinePeopleAlt className="ml-2" />
        <span className="ml-2">Friends</span>
      </Link>
      <Link href="/communities" className={navLinkStyle}>
        <MdOutlineGroups className="ml-2" />
        <span className="ml-2">Communities</span>
      </Link>
    </nav>
  );
};

export default NavBar;
