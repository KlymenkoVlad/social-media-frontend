import React from "react";
import {
  AccountCircleOutlined,
  PeopleAltOutlined,
  NewspaperOutlined,
  GroupsOutlined,
} from "@mui/icons-material";

import LinkSidebar from "./clientSide/LinkSidebar";
import Link from "next/link";

const LeftSidebar = () => {
  const navLinkStyle =
    "flex items-center justify-start hover:bg-gray-200 cursor-pointer transition-colors ease-in-out h-12 rounded-md w-40";

  return (
    <div>
      <ol className="space-y-6 mb-2 min-w-48">
        <li className={navLinkStyle}>
          <AccountCircleOutlined className="ml-2" />
          <LinkSidebar />
        </li>
        <Link href="/news" className={navLinkStyle}>
          <NewspaperOutlined className="ml-2" />
          <p className="ml-2">News</p>
        </Link>
        <Link href="/friends" className={navLinkStyle}>
          <PeopleAltOutlined className="ml-2" />
          <p className="ml-2">Friends</p>
        </Link>
        <Link href="/communities" className={navLinkStyle}>
          <GroupsOutlined className="ml-2" />
          <p className="ml-2">Communities</p>
        </Link>
        <div className="h-px w-full bg-gray-300"></div>
      </ol>

      <footer className="mt-6 text-xs text-gray-500">
        <p>© 2023 Newmedia™.</p>
        <p>All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default LeftSidebar;
