"use client";

import { IPost } from "@/interfaces/post";
import React, { useEffect, useState } from "react";
import Post from "../../../components/post/Post";
import { useInView } from "react-intersection-observer";
import { getAllPosts } from "@/app/_actions";
import PostSkeleton from "../../../components/post/PostSkeleton";
import { SelfImprovement } from "@mui/icons-material";

interface PostResponse {
  posts: IPost[];
  nextCursor: number;
  hasNextPage: boolean;
  postsLength: number;
  setPosts: React.Dispatch<React.SetStateAction<IPost[]>>;
  sortBy: string;
}

const InfiniteScrollPosts = ({
  posts,
  nextCursor,
  hasNextPage,
  setPosts,
  sortBy,
}: PostResponse) => {
  const [cursor, setCursor] = useState<number | undefined>(nextCursor);
  const [end, setEnd] = useState(!hasNextPage);
  const [ref, inView] = useInView();
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

        await setPosts([...data.posts]);

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

    const data: PostResponse = await getAllPosts(cursor, currentSort);

    if (!data.hasNextPage || !hasNextPage) {
      setEnd(true);
    }

    setPosts([...posts, ...data.posts]);

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
        posts.map((post) => (
          <Post
            key={post.id}
            postId={post.id}
            likes={post.likes}
            comments={post.comments}
            text={post.text}
            title={post.title}
            date={post.created_at}
            imageSrc={post.image_url}
            userImage={post.user.image_url}
            username={post.user.username}
          />
        ))}

      <PostSkeleton ref={ref} end={end} />
      <div
        className={`${
          end ? "block" : "hidden"
        } mb-32 w-full text-center text-2xl font-semibold`}
      >
        <SelfImprovement className="h-32 w-32" />
        <p>Hmmmm... I think there are no more posts</p>
      </div>
    </div>
  );
};

export default InfiniteScrollPosts;
