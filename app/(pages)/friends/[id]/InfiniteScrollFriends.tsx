"use client";

import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { IFriend } from "@/interfaces/friend";
import { getAllFriends } from "./actions";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { deleteFriend } from "@/app/_actions";
import { MdPerson, MdSelfImprovement } from "react-icons/md";

interface FriendResponse {
  status: string;
  friends: IFriend[];
  nextCursor: number | null;
  hasNextPage: boolean;
  postsLength: number;
  id: number;
}

const InfiniteScrollFriends = ({
  friends,
  nextCursor,
  hasNextPage,
  id,
}: FriendResponse) => {
  const [cursor, setCursor] = useState<number | null>(nextCursor);
  const [end, setEnd] = useState(!hasNextPage);
  const [ref, inView] = useInView({ rootMargin: "0px 0px 700px 0px" });
  const [renderFriends, setRenderFriends] = useState(friends);
  const [isCurrentUser, setIsCurrentUser] = useState<undefined | boolean>();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    setIsCurrentUser(userId === id.toString());
  }, []);

  const fetchPosts = async () => {
    if (end) {
      return;
    }

    const data: FriendResponse = await getAllFriends(id, cursor);

    if (!data.hasNextPage || !hasNextPage) {
      setEnd(true);
    }

    setRenderFriends([...renderFriends, ...data.friends]);

    setCursor(data.nextCursor);
  };

  useEffect(() => {
    if (inView && !end) {
      fetchPosts();
    }
  }, [inView]);

  return (
    <div>
      {renderFriends &&
        renderFriends?.length > 0 &&
        renderFriends.map((friend) => (
          <ul key={friend.id}>
            <div className="mb-5 flex w-full items-center justify-between rounded-sm bg-white shadow-md">
              <Link
                href={`/profile/${friend.friend.id}`}
                className="flex w-full items-center rounded-md p-3 transition-colors hover:bg-gray-200"
              >
                <div className="relative flex h-24 w-24 items-start justify-center overflow-hidden rounded-full bg-gray-100">
                  {friend.friend.image_url ? (
                    <Image
                      width={100}
                      height={100}
                      src={friend.friend.image_url}
                      alt="Profile Photo"
                    />
                  ) : (
                    <MdPerson
                      className={"absolute text-gray-400"}
                      style={{ width: "120px", height: "120px" }}
                    />
                  )}
                </div>
                <div className="ml-3 space-y-2">
                  <h2 className="text-xl font-semibold">
                    {friend.friend.name}
                  </h2>
                  <p>@{friend.friend.username}</p>
                </div>
              </Link>
              {isCurrentUser && (
                <button
                  type="button"
                  onClick={async () => {
                    toast.loading("Deleting friend...");
                    const status = await deleteFriend(friend.friend.id);
                    toast.remove();
                    if (status === 200) {
                      toast.success("Friend deleted");
                      setRenderFriends((prev) =>
                        prev.filter((prev) => prev.id !== friend.id),
                      );
                      return;
                    }

                    toast.error("Something went wrong");
                  }}
                  className="mx-5 rounded-lg border border-blue-700 px-3 py-2.5 text-center text-sm font-medium text-blue-700 transition-colors hover:bg-blue-800 hover:text-white focus:bg-blue-900 focus:text-white focus:outline-none"
                >
                  Remove friend
                </button>
              )}
            </div>

            <div className="mb-6 h-px w-full bg-gray-400"></div>
          </ul>
        ))}

      <div ref={ref} className={`${end ? "hidden" : "block"}`}>
        Loading...
      </div>
      <div
        className={`${
          end ? "block" : "hidden"
        } mb-32 w-full text-center text-2xl font-semibold`}
      >
        <MdSelfImprovement
          style={{ width: "8rem", height: "8rem" }}
          className="inline"
        />
        <p>Hmmmm... I think there are no more friends</p>
      </div>
    </div>
  );
};

export default InfiniteScrollFriends;
