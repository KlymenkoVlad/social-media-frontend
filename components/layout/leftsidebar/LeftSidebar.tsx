import React from "react";
import {
  AccountCircleOutlined,
  PeopleAltOutlined,
  NewspaperOutlined,
  GroupsOutlined,
} from "@mui/icons-material";

import styles from "./sidebar.module.scss";

const LeftSidebar = () => {
  return (
    <div>
      <ol className="space-y-6 mb-2 min-w-48">
        <li className={`${styles.nav_link}`}>
          <AccountCircleOutlined className="ml-2" />
          <p className="ml-2">My Profile</p>
        </li>
        <li className={styles.nav_link}>
          <NewspaperOutlined className="ml-2" />
          <p className="ml-2">News</p>
        </li>
        <li className={styles.nav_link}>
          <PeopleAltOutlined className="ml-2" />
          <p className="ml-2">Friends</p>
        </li>
        <li className={styles.nav_link}>
          <GroupsOutlined className="ml-2" />
          <p className="ml-2">Communities</p>
        </li>
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
