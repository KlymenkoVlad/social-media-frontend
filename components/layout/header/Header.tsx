import React from "react";
import { Search, KeyboardArrowDown, Clear } from "@mui/icons-material";
import Logo from "../../common/Logo";
import styles from "./header.module.scss";
import BlankAvatar from "@/components/common/BlankAvatar";

const Header = () => {
  return (
    <header className="h-14 shadow-md flex justify-around items-center bg-gray-50">
      <div className="flex items-center">
        <Logo />
        <h1 className="ml-2 text-2xl font-bold">ewmedia</h1>
      </div>

      <div className="relative w-60 h-8 flex ">
        <Search className={`${styles.logo} left-2`} />
        <Clear className={`${styles.logo} right-2`} />
        <input
          className={styles.search_input}
          type="text"
          placeholder="Search"
        />
      </div>

      <div className="hover:bg-gray-300 h-full w-24 flex justify-center items-center cursor-pointer transition-colors">
        <BlankAvatar />
        <KeyboardArrowDown className="text-gray-500" />
      </div>
    </header>
  );
};

export default Header;
