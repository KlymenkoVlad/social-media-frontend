import { IPost } from "@/interfaces/post";
import { User } from "@/interfaces/user";
import React from "react";
import Profile from "./_components/Profile";
import { getPostsByUserId } from "@/actions/post";
import { getUser } from "@/actions/user";

interface UserResponse {
  status: string;
  user: User;
}

interface PostResponse {
  posts: IPost[];
  nextCursor: number;
  hasNextPage: boolean;
  postsLength: number;
}

interface PageProps {
  params: {
    id: string;
  };
}

const page = async ({ params }: PageProps) => {
  const { user }: UserResponse = await getUser(+params.id);
  const { posts, nextCursor, hasNextPage, postsLength }: PostResponse =
    await getPostsByUserId(+params.id);

  return (
    <Profile
      posts={posts}
      nextCursor={nextCursor}
      hasNextPage={hasNextPage}
      postsLength={postsLength}
      user={user}
    />
  );
};

export default page;
