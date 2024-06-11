"use client";

import React, { useEffect, useState } from "react";
import {
  AccountCircleOutlined,
  PeopleAltOutlined,
  NewspaperOutlined,
  GroupsOutlined,
} from "@mui/icons-material";

import Link from "next/link";

const LeftSidebar = () => {
  const navLinkStyle =
    "flex items-center justify-start hover:bg-gray-200 cursor-pointer transition-colors ease-in-out h-12 rounded-md w-40";

  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    setId(localStorage.getItem("userId"));
  }, []);

  return (
    <div>
      <nav className="mb-2 min-w-48 space-y-6">
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

        <div className="h-px w-full bg-gray-300"></div>
      </nav>

      <footer className="mt-6 text-xs text-gray-500">
        <p>© 2023 Newmedia™.</p>
        <p>All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default LeftSidebar;
