"use client";

import { IPost } from "@/interfaces/post";
import React, { useEffect, useState } from "react";
import Post from "./Post";
import { useInView } from "react-intersection-observer";
import { getPosts } from "@/app/_actions";
import PostSkeleton from "./PostSkeleton";
import { SelfImprovement } from "@mui/icons-material";

interface PostResponse {
  posts: IPost[];
  nextCursor: number;
  hasNextPage: boolean;
  postsLength: number;
}

const InfiniteScrollPosts = ({
  posts,
  nextCursor,
  hasNextPage,
  postsLength,
}: PostResponse) => {
  const [postsRender, setPostsRender] = useState(posts);
  const [cursor, setCursor] = useState<number>(nextCursor);
  const [end, setEnd] = useState(false);
  const [ref, inView] = useInView();

  const fetchPosts = async () => {
    if (end) {
      console.log("end");
      return;
    }

    const data: PostResponse = await getPosts(cursor);

    if (!data.hasNextPage || !hasNextPage) {
      setEnd(true);
    }

    setPostsRender([...postsRender, ...data.posts]);

    setCursor(data.nextCursor);
  };

  useEffect(() => {
    if (inView) {
      fetchPosts();
    }
  }, [inView]);

  return (
    <div>
      {postsRender.length > 0 &&
        postsRender
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )
          .map((post) => (
            <Post
              key={post.id}
              postId={post.id}
              likes={post.likes}
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
        } w-full text-center text-2xl font-semibold mb-32`}
      >
        <SelfImprovement className="w-32 h-32" />
        <p>Hmmmm... I think you&apos;ve reached the end</p>
      </div>
    </div>
  );
};

export default InfiniteScrollPosts;
