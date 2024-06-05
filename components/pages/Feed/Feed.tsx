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
    <section className="mx-16 w-full">
      <Form setPosts={setPosts} posts={posts} />

      <div className="mb-4 flex items-center justify-around bg-white p-4">
        <h1 className="text-lg font-bold">You can sort by:</h1>
        <select
          className="block rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
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
