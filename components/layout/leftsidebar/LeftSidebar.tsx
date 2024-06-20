import React from "react";
import NavBar from "./NavBar";
import RightSidebar from "../rightsidebar/RightSidebar";

const LeftSidebar = () => {
  return (
    <aside className="hidden sm:block">
      <NavBar />
      <div className="my-4 h-px w-full bg-gray-300"></div>

      <RightSidebar inLeftSideBar={true} />
      <div className="my-4 block h-px w-full bg-gray-300 lg:hidden"></div>

      <footer className="my-6 text-xs text-gray-500">
        <p>© {new Date().getFullYear()} Newmedia™.</p>
        <p>All Rights Reserved.</p>
      </footer>
    </aside>
  );
};

export default LeftSidebar;
