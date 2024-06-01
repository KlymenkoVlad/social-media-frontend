"use client";

import Form from "@/components/pages/Feed/Form";
import InfiniteScrollPostsProfile from "@/components/pages/Feed/InfiniteScrollPostsProfile";
import { IPost } from "@/interfaces/post";
import { User } from "@/interfaces/user";
import { Person } from "@mui/icons-material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

interface ProfileProps {
  user: User;
  posts: IPost[];
  nextCursor: number;
  hasNextPage: boolean;
  postsLength: number;
}

const Profile = ({
  user,
  posts,
  nextCursor,
  hasNextPage,
  postsLength,
}: ProfileProps) => {
  const [renderPosts, setRenderPosts] = useState(posts);

  const { register, watch } = useForm();

  const sortBy = watch("sortBy") || "new";

  return (
    <div className="w-full h-full mx-5 space-y-6">
      <div className="bg-gray-300  rounded-md w-full relative h-[329px] overflow-hidden">
        <div className="absolute w-full bg-white h-28 bottom-0 rounded-md">
          <div className="rounded-full bg-gray-200 h-36 w-36 absolute left-5 bottom-9 overflow-hidden justify-center items-start flex">
            <Person className=" w-40 h-40 text-gray-400" />
          </div>
          <div className="ml-44 mr-10 flex justify-between items-center mt-5">
            <div>
              <h1 className="">{user?.name}</h1>
              <h1 className=" ">{user?.username}</h1>
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

      <div className=" rounded-md w-full min-h-[329px] overflow-hidden">
        <div className="flex p-4 justify-around items-center bg-white mb-4">
          <h1 className="text-lg font-bold">You can sort by:</h1>
          <select
            className="bg-gray-50 border border-gray-300 focus:outline-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 "
            name="sort"
            id="sort"
            defaultValue="new"
            {...register("sortBy")}
          >
            <option value="new">New</option>
            <option value="old">Old</option>
          </select>
        </div>

        <ul role="list">
          <InfiniteScrollPostsProfile
            posts={renderPosts}
            setRenderPosts={setRenderPosts}
            hasNextPage={hasNextPage}
            nextCursor={nextCursor}
            postsLength={postsLength}
            sortBy={sortBy}
            userId={user.id}
          />
        </ul>
      </div>
    </div>
  );
};

export default Profile;
