import BlankAvatar from "@/components/BlankAvatar";
import { PersonRemove } from "@mui/icons-material";
import React from "react";

const PersonSkeleton = () => {
  return (
    <div className="flex animate-pulse items-center">
      <div className="flex w-full items-center rounded-md p-2 transition-colors hover:bg-gray-100">
        <BlankAvatar />
        <div className="ml-3">
          <p className="">Name</p>
          <p className="text-xs">Username</p>
        </div>
      </div>

      <div className="flex h-8 w-10 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-gray-200">
        <PersonRemove className="text-gray-500" />
      </div>
    </div>
  );
};

export default PersonSkeleton;
