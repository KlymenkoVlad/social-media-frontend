import NavBar from "@/components/layout/leftsidebar/NavBar";
import React from "react";

const LeftSidebarProfile = ({ id }: { id: string }) => {
  return (
    <aside className="hidden sm:block">
      <NavBar />
      <div className="my-4 h-px w-full bg-gray-300"></div>

      <footer className="my-6 text-xs text-gray-500">
        <p>© 2024 Newmedia™.</p>
        <p>All Rights Reserved.</p>
      </footer>
    </aside>
  );
};

export default LeftSidebarProfile;
