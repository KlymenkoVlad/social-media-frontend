"use client";

import { IPost } from "@/interfaces/post";
import React, { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import PostSkeleton from "@/components/ui/post/PostSkeleton";
import Post from "@/components/ui/post/Post";
import { getAllPosts } from "@/actions/post";
import InfiniteScrollEndIcon from "@/components/ui/InfiniteScrollEndIcon";
import { PostResponse } from "../page";

const InfiniteScrollPosts = ({
  posts,
  nextCursor,
  hasNextPage,
  setPosts,
  sortBy,
}: PostResponse & {
  setPosts: React.Dispatch<React.SetStateAction<IPost[]>>;
  sortBy: string;
}) => {
  const [cursor, setCursor] = useState<number | undefined>(nextCursor);
  const [end, setEnd] = useState(!hasNextPage);
  const [ref, inView] = useInView({ rootMargin: "0px 0px 700px 0px" });
  const [currentSort, setCurrentSort] = useState<string>(sortBy);

  useEffect(() => {
    const sortUpdating = async () => {
      if (sortBy !== currentSort) {
        setEnd(false);
        setCursor(undefined);
        setPosts([]);
        const data: PostResponse = await getAllPosts(undefined, sortBy);

        if (!data.hasNextPage || !hasNextPage) {
          setEnd(true);
        }

        setPosts([...data.posts]);

        setCursor(data.nextCursor);
        setCurrentSort(sortBy);
      }
    };

    sortUpdating();
  }, [sortBy]);

  const fetchPosts = useCallback(async () => {
    if (end) {
      return;
    }

    const data: PostResponse = await getAllPosts(cursor, currentSort);

    if (!data.hasNextPage || !hasNextPage) {
      setEnd(true);
    }

    setPosts([...posts, ...data.posts]);

    setCursor(data.nextCursor);
  }, [cursor, end, setPosts]);

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
