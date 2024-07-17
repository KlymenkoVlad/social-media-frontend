"use client";

import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { User } from "@/interfaces/user";
import BlankAvatar from "@/components/ui/BlankAvatar";
import Link from "next/link";
import { findUserByUsername } from "@/actions/user";
import InfiniteScrollEndIcon from "@/components/ui/InfiniteScrollEndIcon";

interface UsersParams {
  users: User[];
  status: string;
  nextCursor: number | null;
  hasNextPage: boolean;
  usersLength: number;
  searchSlug: string;
}

const InfiniteScrollUsers = ({
  users,
  nextCursor,
  hasNextPage,
  searchSlug,
}: UsersParams) => {
  const [cursor, setCursor] = useState<number | null>(nextCursor);
  const [end, setEnd] = useState(!hasNextPage);
  const [ref, inView] = useInView({ rootMargin: "0px 0px 700px 0px" });
  const [renderUsers, setRenderUsers] = useState<User[]>(users);

  const fetchPosts = async () => {
    if (end || !cursor) {
      return;
    }

    const data: Omit<UsersParams, "searchSlug"> = await findUserByUsername(
      searchSlug,
      cursor,
    );

    if (!data.hasNextPage || !hasNextPage) {
      setEnd(true);
    }

    setRenderUsers([...renderUsers, ...data.users]);

    setCursor(data.nextCursor);
  };

  useEffect(() => {
    if (inView && !end) {
      fetchPosts();
    }
  }, [inView]);

  return (
    <div className="grid gap-2 lg:grid-cols-2 lg:gap-6">
      {users &&
        users.length > 0 &&
        users.map((user) => (
          <div
            className="flex w-full items-center justify-between bg-gray-50 px-2 py-4"
            key={user.id}
          >
            <div className="flex items-center space-x-3">
              <BlankAvatar imageSrc={user?.imageUrl} />

              <div>
                <p className="font-semibold">
                  {user?.name} {user?.surname}
                </p>
                <p className="text-gray-600">@{user?.username}</p>
              </div>
            </div>

            <Link
              className="block w-fit rounded-md bg-gray-200 p-2 transition-colors hover:bg-gray-300"
              href={`/profile/${user?.id}`}
            >
              Go to profile
            </Link>
          </div>
        ))}

      <div
        ref={ref}
        className={`${
          end ? "hidden" : "block"
        } mb-5 flex w-full animate-pulse items-center justify-between space-y-4 overflow-auto rounded-md bg-white p-5 opacity-50`}
      >
        <div className="flex items-center space-x-3">
          <BlankAvatar />

          <div>
            <p className="font-semibold">Name</p>
            <p className="text-gray-600">@username</p>
          </div>
        </div>

        <button
          disabled
          className="rounded-md p-1 transition-colors hover:bg-gray-200"
        >
          Go to profile
        </button>
      </div>

      <InfiniteScrollEndIcon end={end} text="users" />
    </div>
  );
};

export default InfiniteScrollUsers;
