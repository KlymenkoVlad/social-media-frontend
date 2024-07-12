"use client";

import { IPost } from "@/interfaces/post";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { MdSelfImprovement } from "react-icons/md";
import PostSkeleton from "@/components/post/PostSkeleton";
import Post from "@/components/post/Post";
import { getAllPosts } from "@/actions/post";

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
            userId={post.userId}
            postId={post.id}
            likes={post.likes}
            comments={post.comments}
            text={post.text}
            title={post.title}
            date={post.createdAt}
            imageSrc={post.imageUrl}
            userImage={post.user.imageUrl}
            username={post.user.username}
            community={post.community}
          />
          // <p key={post.id}>{post.text}</p>
        ))}

      <PostSkeleton ref={ref} end={end} />
      {/* <p ref={ref}>loading</p> */}
      <div
        className={`${
          end ? "block" : "hidden"
        } mb-32 w-full text-center text-2xl font-semibold`}
      >
        <MdSelfImprovement className="inline h-32 w-32" />
        <p>Hmmmm... I think there are no more posts</p>
      </div>
    </div>
  );
};

export default InfiniteScrollPosts;
