import React, { useState } from "react";
import { Metadata } from "next";
import { IPost } from "@/interfaces/post";
import { getAllPosts } from "@/app/_actions";
import Feed from "@/components/pages/Feed/Feed";

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

const page = async () => {
  const data: PostResponse = await getAllPosts();

  // console.log(data);

  return <Feed data={data} />;
};

export default page;
