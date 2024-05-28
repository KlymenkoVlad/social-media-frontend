"use client";

import React, { useState } from "react";
import { Metadata } from "next";
import Form from "@/components/pages/Feed/Form";
import { IPost } from "@/interfaces/post";
import { getPosts } from "@/app/_actions";
import InfiniteScrollPosts from "@/components/pages/Feed/InfiniteScrollPosts";

export const metadata: Metadata = {
  title: "Feed",
  description:
    "Social media app that helps you connect and share with the people in your life.",
};

interface PostResponse {
  posts: IPost[];
  nextCursor: number;
  hasNextPage: boolean;
  postsLength: number;
}

const Feed = async () => {
  const data: PostResponse = await getPosts();

  return (
    <div className="w-full mx-16 ">
      <Form />
      <ul role="list">
        <InfiniteScrollPosts {...data} />
      </ul>
    </div>
  );
};

export default eed;
