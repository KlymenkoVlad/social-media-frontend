"use client";

import { IPost } from "@/interfaces/post";
import React, { useEffect, useState } from "react";
import Post from "../../../../../components/post/Post";
import { useInView } from "react-intersection-observer";
import { findUserByUsername, getPostsByUserId } from "@/app/_actions";
import PostSkeleton from "../../../../../components/post/PostSkeleton";
import { SelfImprovement } from "@mui/icons-material";
import { User } from "@/interfaces/user";
import BlankAvatar from "@/components/BlankAvatar";
import Link from "next/link";

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
  const [ref, inView] = useInView();
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
    <div className="grid grid-cols-2 gap-6">
      {users &&
        users?.length > 0 &&
        users.map((user) => (
          <div
            className="flex w-full items-center justify-between bg-gray-50 p-4"
            key={user.id}
          >
            <div className="flex items-center space-x-3">
              <BlankAvatar imageSrc={user?.image_url} />

              <div>
                <p className="font-semibold">
                  {user?.name} {user?.surname}
                </p>
                <p className="text-gray-600">@{user?.username}</p>
              </div>
            </div>

            <Link
              className="rounded-md bg-gray-200 p-2 transition-colors hover:bg-gray-300"
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

        <p className="rounded-md p-2 transition-colors hover:bg-gray-200">
          Go to profile
        </p>
      </div>

      <div
        className={`${
          end ? "block" : "hidden"
        } col-span-2 mb-32 w-full text-center text-2xl font-semibold`}
      >
        <SelfImprovement className="h-32 w-32" />
        <p>Hmmmm... I think there are no users that match your search</p>
      </div>
    </div>
  );
};

export default InfiniteScrollUsers;
