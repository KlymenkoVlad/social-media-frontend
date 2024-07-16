import { IFriend } from "@/interfaces/friend";
import React from "react";
import InfiniteScrollFriends from "./_components/InfiniteScrollFriends";
import { Metadata } from "next";
import { getAllFriends } from "@/actions/friend";

interface FriendResponse {
  status: string;
  friends: IFriend[];
  nextCursor: number | null;
  hasNextPage: boolean;
  postsLength: number;
}

export const metadata: Metadata = {
  title: "Friends",
  description:
    "Social media app that helps you connect and share with the people in your life.",
};

const page = async ({ params }: { params: { id: string } }) => {
  const friends: FriendResponse = await getAllFriends(params.id);

  return (
    <main className="w-full rounded-md px-1 md:px-5">
      <h1 className="mb-6 text-center text-xl font-semibold">
        That&apos;s all friends:
      </h1>
      <InfiniteScrollFriends id={+params.id} {...friends} />
    </main>
  );
};

export default page;
