"use client";

import {
  AccountCircleOutlined,
  GroupsOutlined,
  PeopleAltOutlined,
} from "@mui/icons-material";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const NavBar = () => {
  const [id, setId] = useState<string | null>(null);

  const navLinkStyle =
    "flex items-center justify-start hover:bg-gray-200 cursor-pointer transition-colors ease-in-out h-12 rounded-md w-40";

  useEffect(() => {
    setId(localStorage.getItem("userId"));
  }, []);
  return (
    <nav className="min-w-48 space-y-6">
      <Link href={`/profile/${id}`} className={navLinkStyle}>
        <AccountCircleOutlined className="ml-2" />
        <span className="ml-2">My Profile</span>
      </Link>
      <Link href={`/friends/${id}`} className={navLinkStyle}>
        <PeopleAltOutlined className="ml-2" />
        <span className="ml-2">Friends</span>
      </Link>
      <Link href="/communities" className={navLinkStyle}>
        <GroupsOutlined className="ml-2" />
        <span className="ml-2">Communities</span>
      </Link>
    </nav>
  );
};

export default NavBar;
