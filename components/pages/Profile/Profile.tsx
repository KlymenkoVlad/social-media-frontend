"use client";

import {
  addFriendRequest,
  changeRequestStatus,
  deleteFriend,
  getRequestInfo,
} from "@/app/_actions";
import InfiniteScrollPostsProfile from "@/components/pages/Profile/InfiniteScrollPostsProfile";
import { IPost } from "@/interfaces/post";
import { User } from "@/interfaces/user";
import { Person } from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface ProfileProps {
  user: User;
  posts: IPost[];
  nextCursor: number;
  hasNextPage: boolean;
  postsLength: number;
}

export enum FriendRequestStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED",
  ADD_FRIEND = "ADD_FRIEND",
  REQUEST_FRIEND = "REQUEST_FRIEND",
}

const Button = ({
  requestInfo,
  user,
  setRequestInfo,
}: {
  requestInfo: FriendRequestStatus;
  user: User;
  setRequestInfo: React.Dispatch<React.SetStateAction<FriendRequestStatus>>;
}) => {
  if (requestInfo == FriendRequestStatus.PENDING) {
    return (
      <button
        type="button"
        onClick={async () => {
          toast.loading("Cancelling friend request...");
          const status = await deleteFriend(user.id);
          toast.remove();
          if (status === 200) {
            toast.success("Friend request canceled");
            setRequestInfo(FriendRequestStatus.REQUEST_FRIEND);
            return;
          }

          toast.error("Something went wrong");
        }}
        className="border-text flex w-full transform cursor-pointer items-center justify-center rounded-sm border-2 border-blue-300 px-4 py-4 text-sm font-bold capitalize leading-6 transition-all duration-100 hover:-translate-y-1 hover:border-red-300 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 sm:w-auto sm:px-6"
      >
        <span>Cancel request</span>
      </button>
    );
  }

  if (requestInfo == FriendRequestStatus.ACCEPTED) {
    return (
      <button
        type="button"
        onClick={async () => {
          toast.loading("Deleting friend...");
          const status = await deleteFriend(user.id);
          toast.remove();
          if (status === 200) {
            toast.success("Friend deleted");
            setRequestInfo(FriendRequestStatus.REQUEST_FRIEND);
            return;
          }

          toast.error("Something went wrong");
        }}
        className="rounded-lg border border-blue-700 px-5 py-2.5 text-center text-sm font-medium text-blue-700 transition-colors hover:bg-blue-800 hover:text-white focus:bg-blue-900 focus:text-white focus:outline-none"
      >
        Remove friend
      </button>
    );
  }

  if (requestInfo == FriendRequestStatus.DECLINED) {
    return;
  }

  if (requestInfo == FriendRequestStatus.ADD_FRIEND) {
    return (
      <div className="flex space-x-3">
        <button
          type="button"
          onClick={async () => {
            toast.loading("Accepting friend request...");
            const status = await changeRequestStatus(
              user.id,
              FriendRequestStatus.ACCEPTED,
            );
            toast.remove();
            if (!status.error) {
              toast.success("Now you are friends");
              setRequestInfo(FriendRequestStatus.ACCEPTED);
              return;
            }

            toast.error("Something went wrong");
          }}
          className="border-text flex w-full transform cursor-pointer items-center justify-center rounded-sm border-2 border-green-300 px-2 py-2 text-sm font-bold capitalize leading-6 transition-all duration-100 hover:-translate-y-1 hover:border-green-300 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 sm:w-auto"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={async () => {
            toast.loading("Declining friend request...");
            const status = await deleteFriend(user.id);
            toast.remove();
            if (status === 200) {
              toast.success("Friend request declined");
              setRequestInfo(FriendRequestStatus.REQUEST_FRIEND);
              return;
            }

            toast.error("Something went wrong");
          }}
          className="border-text flex w-full transform cursor-pointer items-center justify-center rounded-sm border-2 border-red-300 px-2 py-2 text-sm font-bold capitalize leading-6 transition-all duration-100 hover:-translate-y-1 hover:border-red-300 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 sm:w-auto"
        >
          Decline
        </button>
      </div>
    );
  }

  if (requestInfo == FriendRequestStatus.REQUEST_FRIEND) {
    return (
      <button
        type="button"
        onClick={async () => {
          toast.loading("Adding friend...");
          const res = await addFriendRequest(user.id);
          toast.remove();
          if (!res.error) {
            toast.success("Friend request sent");
            setRequestInfo(FriendRequestStatus.PENDING);
            return;
          }
          toast.error(res.message);
        }}
        className="border-text flex transform cursor-pointer items-center justify-center rounded-sm border-2 border-blue-300 px-4 py-4 text-sm font-bold capitalize leading-6 duration-100 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 sm:w-auto sm:px-6"
      >
        Add friend
      </button>
    );
  }
};

const Profile = ({
  user,
  posts,
  nextCursor,
  hasNextPage,
  postsLength,
}: ProfileProps) => {
  const [renderPosts, setRenderPosts] = useState(posts);
  const [userId, setUserId] = useState<string | undefined>();
  const [requestInfo, setRequestInfo] =
    useState<FriendRequestStatus>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUserId(localStorage.getItem("userId"));

    const fetchCurrentUserInfo = async () => {
      const res: FriendRequestStatus = await getRequestInfo(user.id);

      setRequestInfo(res);
      setLoading(false);
    };

    fetchCurrentUserInfo();
  }, []);

  const { register, watch } = useForm();

  const sortBy = watch("sortBy") || "new";

  return (
    <section className="h-full w-full space-y-6 px-5">
      <div className="relative h-[300px] w-full overflow-hidden rounded-md bg-gray-300">
        <div className="absolute bottom-0 h-36 w-full rounded-md bg-white">
          {user?.image_url ? (
            <div className="absolute bottom-12 left-5 flex h-36 w-36 items-start justify-center overflow-hidden rounded-full border-4 border-white bg-gray-200">
              <Image
                width={100}
                height={100}
                alt="Profile Photo"
                src={user?.image_url}
                className="h-full w-full rounded-full"
              />
            </div>
          ) : (
            <div className="absolute bottom-12 left-5 flex h-36 w-36 items-start justify-center overflow-hidden rounded-full bg-gray-200">
              <Person className="h-40 w-40 text-gray-400" />
            </div>
          )}
          <div className="ml-44 mr-5 mt-5 flex items-center justify-between">
            <div>
              <h1 className="font-semibold">
                {user?.name} {user?.surname}{" "}
                {user?.age && `| ${user?.age} years`}
              </h1>
              <h2 className="text-gray-500">@{user?.username}</h2>
            </div>

            {!loading ? (
              +userId === user?.id ? (
                <Link
                  type="button"
                  href={`/settings`}
                  className="rounded-lg border border-blue-700 px-5 py-2.5 text-center text-sm font-medium text-blue-700 transition-colors hover:bg-blue-800 hover:text-white focus:bg-blue-900 focus:text-white focus:outline-none"
                >
                  Edit Profile
                </Link>
              ) : (
                <Button
                  requestInfo={requestInfo}
                  user={user}
                  setRequestInfo={setRequestInfo}
                />
              )
            ) : (
              <button
                type="button"
                disabled
                className="rounded-lg border border-blue-700 px-5 py-2.5 text-center text-sm font-medium text-blue-700 transition-colors hover:bg-blue-800 hover:text-white focus:bg-blue-900 focus:text-white focus:outline-none"
              >
                Loading...
              </button>
            )}
          </div>

          {user?.description ? (
            <p className="mx-4 mt-10">{user.description}</p>
          ) : (
            <p className="mx-4 mt-10 text-gray-500">No description specified</p>
          )}
        </div>
      </div>

      <div className="min-h-[329px] w-full overflow-hidden rounded-md">
        <div className="mb-4 flex items-center justify-around bg-white p-4">
          <h1 className="text-lg font-bold">You can sort by:</h1>
          <select
            className="block rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            name="sort"
            id="sort"
            defaultValue="new"
            {...register("sortBy")}
          >
            <option value="new">New</option>
            <option value="old">Old</option>
          </select>
        </div>

        <ul role="list">
          <InfiniteScrollPostsProfile
            posts={renderPosts}
            setRenderPosts={setRenderPosts}
            hasNextPage={hasNextPage}
            nextCursor={nextCursor}
            postsLength={postsLength}
            sortBy={sortBy}
            userId={user.id}
          />
        </ul>
      </div>
    </section>
  );
};

export default Profile;
