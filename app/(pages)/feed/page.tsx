import { Metadata } from "next";
import { IPost } from "@/interfaces/post";
import Feed from "@/app/(pages)/feed/_components/Feed";
import { getAllPosts } from "@/actions/post";

export const metadata: Metadata = {
  title: "Feed",
  description:
    "Social media app that helps you connect and share with the people in your life.",
};

export interface PostResponse {
  posts: IPost[];
  nextCursor: number;
  hasNextPage: boolean;
  postsLength: number;
}

const page = async () => {
  const data: PostResponse = await getAllPosts();

  return <Feed data={data} />;
};

export default page;
