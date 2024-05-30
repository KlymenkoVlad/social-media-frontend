"use client";

import React, { useState } from "react";
import Form from "./Form";
import InfiniteScrollPosts from "./InfiniteScrollPosts";
import { IPost } from "@/interfaces/post";

interface PostResponse {
  posts: IPost[];
  nextCursor: number;
  hasNextPage: boolean;
  postsLength: number;
}

const Feed = ({ data }: { data: PostResponse }) => {
  const [posts, setPosts] = useState(data.posts);

  return (
    <div className="w-full mx-16 ">
      <Form setPosts={setPosts} posts={posts} />
      <ul role="list">
        <InfiniteScrollPosts
          setPosts={setPosts}
          posts={posts}
          hasNextPage={data.hasNextPage}
          nextCursor={data.nextCursor}
          postsLength={data.postsLength}
        />
      </ul>
    </div>
  );
};

export default Feed;
