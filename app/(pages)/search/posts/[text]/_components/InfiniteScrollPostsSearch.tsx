"use client";

import { IPost } from "@/interfaces/post";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { findPosts } from "@/actions/post";
import Post from "@/components/ui/post/Post";
import PostSkeleton from "@/components/ui/post/PostSkeleton";
import InfiniteScrollEndIcon from "@/components/ui/InfiniteScrollEndIcon";

interface PostResponse {
  posts: IPost[];
  nextCursor: number;
  hasNextPage: boolean;
  postsLength: number;
  text: string;
}

const InfiniteScrollPostsSearch = ({
  posts,
  nextCursor,
  hasNextPage,
  text,
}: PostResponse) => {
  const [cursor, setCursor] = useState<number>(nextCursor);
  const [end, setEnd] = useState(!hasNextPage);
  const [ref, inView] = useInView({ rootMargin: "0px 0px 700px 0px" });
  const [renderPosts, setRenderPosts] = useState(posts);

  const fetchPosts = async () => {
    if (end) {
      return;
    }

    const data: PostResponse = await findPosts(text, cursor);

    if (!data.hasNextPage || !hasNextPage) {
      setEnd(true);
    }

    setRenderPosts([...renderPosts, ...data.posts]);

    setCursor(data.nextCursor);
  };

  useEffect(() => {
    if (inView && !end) {
      fetchPosts();
    }
  }, [inView]);

  return (
    <div>
      {renderPosts &&
        renderPosts?.length > 0 &&
        renderPosts.map((post) => <Post key={post.id} {...post} />)}

      <PostSkeleton ref={ref} end={end} />
      <InfiniteScrollEndIcon end={end} text="posts" />
    </div>
  );
};

export default InfiniteScrollPostsSearch;
