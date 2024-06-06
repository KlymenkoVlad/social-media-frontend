"use client";

import { IPost } from "@/interfaces/post";
import React, { useEffect, useState } from "react";
import Post from "../../../../../components/post/Post";
import { useInView } from "react-intersection-observer";
import { findPosts, getPostsByUserId } from "@/app/_actions";
import PostSkeleton from "../../../../../components/post/PostSkeleton";
import { SelfImprovement } from "@mui/icons-material";

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
  const [ref, inView] = useInView();
  const [renderPosts, setRenderPosts] = useState(posts);

  console.log(renderPosts);

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
        renderPosts.map((post) => (
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

export default InfiniteScrollPostsSearch;
