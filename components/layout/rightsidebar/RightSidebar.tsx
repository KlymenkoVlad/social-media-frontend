import BlankAvatar from "@/components/common/BlankAvatar";
import { PersonAdd } from "@mui/icons-material";
import React from "react";

const Person = () => {
  return (
    <li className="flex items-center">
      <div className="flex w-full items-center">
        <BlankAvatar />
        <div className="ml-3">
          <p className="">name</p>
          <p className="text-xs">desciption</p>
        </div>
      </div>

      <div className="flex h-8 w-10 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-gray-200">
        <PersonAdd className="text-gray-500" />
      </div>
    </li>
  );
};

const RightSidebar = () => {
  return (
    <div className="block h-96 min-w-60 rounded-md bg-white p-5 shadow-md">
      <h2 className="mb-4 text-center">People you may know</h2>
      <ul className="mb-6 space-y-8">
        <Person />
        <Person />
        <Person />
        <Person />
      </ul>
      <button
        type="button"
        className="h-7 w-full rounded-full bg-blue-100 text-center align-middle text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
      >
        Show all
      </button>
    </div>
  );
};

export default RightSidebar;
