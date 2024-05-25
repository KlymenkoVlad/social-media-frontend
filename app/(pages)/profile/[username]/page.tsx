import { getDataAuth } from "@/db/fetchData";
import { User } from "@/interfaces/user";
import { Person } from "@mui/icons-material";
import React from "react";

const page = async ({ params }: { params: { username: string } }) => {
  const data: User = await getDataAuth(`auth/user/${params.username}`);

  return (
    <div className="w-full h-full mx-5 space-y-6">
      <div className="bg-gray-300  rounded-md w-full relative h-[329px] overflow-hidden">
        <div className="absolute w-full bg-white h-28 bottom-0 rounded-md">
          <div className="rounded-full bg-gray-200 h-36 w-36 absolute left-5 bottom-9 overflow-hidden justify-center items-start flex">
            <Person className=" w-40 h-40 text-gray-400" />
          </div>
          <div className="ml-44 mr-10 flex justify-between items-center mt-5">
            <div>
              <h1 className="">{data.name}</h1>
              <h1 className=" ">{data.username}</h1>
            </div>

            <button
              type="button"
              className="transition-colors text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:bg-blue-900 focus:text-white focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-md w-full min-h-[329px] overflow-hidden">
        <div className="flex p-4 justify-around">
          <button
            type="button"
            className="transition-colors text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:bg-blue-900 focus:text-white focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            All Posts
          </button>
          <button
            type="button"
            className="transition-colors text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:bg-blue-900 focus:text-white focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Filter Posts
          </button>
        </div>
        <div className="h-px w-full bg-gray-300"></div>
      </div>
    </div>
  );
};

export default page;
