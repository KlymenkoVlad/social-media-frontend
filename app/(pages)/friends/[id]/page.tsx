import { getFriendsList } from "@/app/profile/[id]/actions";
import { IFriend } from "@/interfaces/friend";
import React from "react";
import { getAllFriends } from "./actions";
import InfiniteScrollFriends from "./InfiniteScrollFriends";

interface FriendResponse {
  status: string;
  friends: IFriend[];
  nextCursor: number | null;
  hasNextPage: boolean;
  postsLength: number;
}

const page = async ({ params }: { params: { id: string } }) => {
  const friends: FriendResponse = await getAllFriends(params.id);

  return (
    <section className="w-full rounded-md px-5">
      <h1 className="mb-6 text-center text-xl font-semibold">
        That&apos;s all friends:
      </h1>
      <InfiniteScrollFriends id={+params.id} {...friends} />
    </section>
  );
};

export default page;
