import { findPosts } from "@/actions/post";
import InfiniteScrollPosts from "@/app/(pages)/feed/InfiniteScrollPosts";
import InfiniteScrollPostsSearch from "@/app/(pages)/search/posts/[text]/InfiniteScrollPostsSearch";
import { IPost } from "@/interfaces/post";
import React from "react";

interface PostsResponse {
  posts: IPost[];
  status: string;
  nextCursor: number;
  hasNextPage: boolean;
  postsLength: number;
}

const page = async ({ params }: { params: { text: string } }) => {
  const posts: PostsResponse = await findPosts(params.text);

  return (
    <section className="w-full px-1 md:px-5">
      <h1 className="mb-6 text-center text-xl font-semibold">
        That&apos;s all we managed to find by your search: {params.text}
      </h1>
      <InfiniteScrollPostsSearch text={params.text} {...posts} />
    </section>
  );
};

export default page;
