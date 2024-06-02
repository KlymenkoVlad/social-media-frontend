"use client";

import React, { useState } from "react";
import Form from "./Form";
import InfiniteScrollPosts from "./InfiniteScrollPosts";
import { IPost } from "@/interfaces/post";
import { useForm } from "react-hook-form";

interface PostResponse {
  posts: IPost[];
  nextCursor: number;
  hasNextPage: boolean;
  postsLength: number;
}

const Feed = ({ data }: { data: PostResponse }) => {
  const [posts, setPosts] = useState(data.posts);

  const { register, watch } = useForm();

  const sortBy = watch("sortBy") || "new";

  return (
    <section className="w-full mx-16 ">
      <Form setPosts={setPosts} posts={posts} />

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
        <InfiniteScrollPosts
          setPosts={setPosts}
          posts={posts}
          hasNextPage={data.hasNextPage}
          nextCursor={data.nextCursor}
          postsLength={data.postsLength}
          sortBy={sortBy}
        />
      </ul>
    </section>
  );
};

export default Feed;
