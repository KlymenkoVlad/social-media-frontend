import BlankAvatar from "@/components/common/BlankAvatar";
import { PersonAdd } from "@mui/icons-material";
import React from "react";

const Person = () => {
  return (
    <li className="flex items-center">
      <div className="flex items-center w-full ">
        <BlankAvatar />
        <div className="ml-3">
          <p className="">name</p>
          <p className=" text-xs">desciption</p>
        </div>
      </div>

      <div className="flex justify-center items-center rounded-full hover:bg-gray-200 transition-colors cursor-pointer w-10 h-8">
        <PersonAdd className="text-gray-500" />
      </div>
    </li>
  );
};

const RightSidebar = () => {
  return (
    <div className="p-5 min-w-60 h-96 block bg-white rounded-md shadow-md">
      <h2 className="text-center mb-4">People you may know</h2>
      <ul className="space-y-8 mb-6">
        <Person />
        <Person />
        <Person />
        <Person />
      </ul>
      <button
        type="button"
        className="transition-colors text-center h-7 align-middle w-full text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-4 focus:ring-blue-300 font-semibold rounded-full text-sm"
      >
        Show all
      </button>
    </div>
  );
};

export default RightSidebar;
