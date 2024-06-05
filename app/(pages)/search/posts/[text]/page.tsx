import { findPosts } from "@/app/_actions";
import InfiniteScrollPosts from "@/components/pages/Feed/InfiniteScrollPosts";
import InfiniteScrollPostsSearch from "@/components/pages/PostsSearch/InfiniteScrollPostsSearch";
import { IPost } from "@/interfaces/post";
import React from "react";

interface PostsResponse {
  posts: IPost[];
  status: string;
  nextCursor: number | null;
  hasNextPage: boolean;
  postsLength: number;
}

const page = async ({ params }: { params: { text: string } }) => {
  const posts: PostsResponse = await findPosts(params.text);

  return (
    <section className="w-full px-4">
      <h1 className="mb-6 text-center text-xl font-semibold">
        That&apos;s all we managed to find by your search: {params.text}
      </h1>
      <InfiniteScrollPostsSearch text={params.text} {...posts} />
    </section>
  );
};

export default page;
