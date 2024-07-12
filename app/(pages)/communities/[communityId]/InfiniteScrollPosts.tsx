"use client";

import { IPost } from "@/interfaces/post";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import PostSkeleton from "@/components/post/PostSkeleton";
import Post from "@/components/post/Post";
import { MdSelfImprovement } from "react-icons/md";
import { getCommunityPosts } from "@/actions/community";

interface PostResponse {
  posts: IPost[];
  nextCursor: number | null;
  hasNextPage: boolean;
  postsLength: number;
  setRenderPosts: React.Dispatch<React.SetStateAction<IPost[]>>;
  sortBy: string;
  communityId: number;
}

const InfiniteScrollPosts = ({
  posts,
  nextCursor,
  hasNextPage,
  setRenderPosts,
  sortBy,
  communityId,
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
        const data: PostResponse = await getCommunityPosts(
          communityId,
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

    const data: PostResponse = await getCommunityPosts(
      communityId,
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
        posts.map((post) => (
          <Post
            key={post.id}
            postId={post.id}
            userId={post.userId}
            likes={post.likes}
            userImage={post.user.imageUrl}
            comments={post.comments}
            text={post.text}
            title={post.title}
            date={post.createdAt}
            imageSrc={post.imageUrl}
            username={post.user.username}
            community={post.community}
          />
        ))}

      <PostSkeleton ref={ref} end={end} />
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
