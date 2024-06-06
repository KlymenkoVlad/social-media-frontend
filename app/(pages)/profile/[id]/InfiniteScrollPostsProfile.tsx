"use client";

import { IPost } from "@/interfaces/post";
import React, { useEffect, useState } from "react";
import Post from "../../../../components/post/Post";
import { useInView } from "react-intersection-observer";
import { getPostsByUserId } from "@/app/_actions";
import PostSkeleton from "../../../../components/post/PostSkeleton";
import { SelfImprovement } from "@mui/icons-material";

interface PostResponse {
  posts: IPost[];
  nextCursor: number;
  hasNextPage: boolean;
  postsLength: number;
  setRenderPosts: React.Dispatch<React.SetStateAction<IPost[]>>;
  sortBy: string;
  userId: number;
}

const InfiniteScrollPostsProfile = ({
  posts,
  nextCursor,
  hasNextPage,
  setRenderPosts,
  sortBy,
  userId,
}: PostResponse) => {
  const [cursor, setCursor] = useState<number | null>(nextCursor);
  const [end, setEnd] = useState(!hasNextPage);
  const [ref, inView] = useInView();
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
        posts.map((post) => (
          <Post
            key={post.id}
            postId={post.id}
            likes={post.likes}
            userImage={post.user.image_url}
            comments={post.comments}
            text={post.text}
            title={post.title}
            date={post.created_at}
            imageSrc={post.image_url}
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

export default InfiniteScrollPostsProfile;
