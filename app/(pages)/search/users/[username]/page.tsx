import { findUserByUsername } from "@/app/_actions";
import InfiniteScrollUsers from "@/app/(pages)/search/users/[username]/InfiniteScrollUsers";
import { User } from "@/interfaces/user";
import React from "react";

interface UsersResponse {
  users: User[];
  status: string;
  nextCursor: number | null;
  hasNextPage: boolean;
  usersLength: number;
}

const page = async ({ params }: { params: { username: string } }) => {
  const users: UsersResponse = await findUserByUsername(params.username);

  return (
    <section className="w-full px-5">
      <h1 className="mb-6 text-center text-xl font-semibold">
        That&apos;s all we managed to find by your search: {params.username}
      </h1>
      <InfiniteScrollUsers searchSlug={params.username} {...users} />
    </section>
  );
};

export default page;
