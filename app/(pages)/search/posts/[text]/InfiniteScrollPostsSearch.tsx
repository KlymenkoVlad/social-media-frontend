"use client";

import { IPost } from "@/interfaces/post";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { MdSelfImprovement } from "react-icons/md";
import { findPosts } from "@/actions/post";
import Post from "@/components/post/Post";
import PostSkeleton from "@/components/post/PostSkeleton";

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
        renderPosts.map((post) => (
          <Post
            key={post.id}
            userId={post.userId}
            postId={post.id}
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

export default InfiniteScrollPostsSearch;
