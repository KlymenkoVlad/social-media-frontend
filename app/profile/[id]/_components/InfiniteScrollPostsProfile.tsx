"use client";

import { IPost } from "@/interfaces/post";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import PostSkeleton from "@/components/ui/post/PostSkeleton";
import Post from "@/components/ui/post/Post";
import { getPostsByUserId } from "@/actions/post";
import InfiniteScrollEndIcon from "@/components/ui/InfiniteScrollEndIcon";

interface PostResponse {
  posts: IPost[];
  nextCursor: number;
  hasNextPage: boolean;
  postsLength: number;
  setRenderPosts: React.Dispatch<React.SetStateAction<IPost[]>>;
  sortBy: string;
  userId: number;
}

const InfiniteScrollPosts = ({
  posts,
  nextCursor,
  hasNextPage,
  setRenderPosts,
  sortBy,
  userId,
}: PostResponse) => {
  const [cursor, setCursor] = useState<number | null>(nextCursor);
  const [end, setEnd] = useState(!hasNextPage);
  const [ref, inView] = useInView({ rootMargin: "0px 0px 700px 0px" });
  const [currentSort, setCurrentSort] = useState<string>(sortBy);

  useEffect(() => {
    const sortUpdating = async () => {
      if (sortBy !== currentSort) {
        setEnd(false);
        setCursor(null);
        setRenderPosts([]);
        const data: PostResponse = await getPostsByUserId(
          userId,
          sortBy,
          undefined,
        );

        if (!data.hasNextPage || !hasNextPage) {
          setEnd(true);
        }

        setRenderPosts([...data.posts]);

        setCursor(data.nextCursor);
        setCurrentSort(sortBy);
      }
    };

    sortUpdating();
  }, [sortBy]);

  const fetchPosts = async () => {
    if (end) {
      return;
    }

    const data: PostResponse = await getPostsByUserId(
      userId,
      currentSort,
      cursor,
    );

    if (!data.hasNextPage || !hasNextPage) {
      setEnd(true);
    }

    setRenderPosts([...posts, ...data.posts]);

    setCursor(data.nextCursor);
  };

  useEffect(() => {
    if (inView && sortBy === currentSort && !end) {
      fetchPosts();
    }
  }, [inView]);

  return (
    <div>
      {posts &&
        posts?.length > 0 &&
        posts.map((post) => <Post key={post.id} {...post} />)}

      <PostSkeleton ref={ref} end={end} />
      <InfiniteScrollEndIcon end={end} text="posts" />
    </div>
  );
};

export default InfiniteScrollPosts;
