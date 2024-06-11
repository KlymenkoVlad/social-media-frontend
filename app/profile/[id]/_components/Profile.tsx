"use client";

import {
  addFriendRequest,
  changeRequestStatus,
  deleteFriend,
  getRequestInfo,
} from "@/app/_actions";
import InfiniteScrollPostsProfile from "./InfiniteScrollPostsProfile";
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
  ACCEPT = "ACCEPT",
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED",
  NO_INTERACTIONS = "NO_INTERACTIONS",
}

const Button = ({
  handleSubmit,
  text,
}: {
  handleSubmit: () => void;
  text: string;
}) => (
  <button
    onClick={handleSubmit}
    className="border-text flex w-auto cursor-pointer items-center justify-center rounded-sm border-2 border-blue-300 p-1 text-sm font-bold capitalize leading-6 transition-colors hover:border-blue-500 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-10"
  >
    <span>{text}</span>
  </button>
);

const ButtonLogic = ({
  requestInfo,
  user,
  setRequestInfo,
}: {
  requestInfo: FriendRequestStatus | undefined;
  user: User;
  setRequestInfo: React.Dispatch<
    React.SetStateAction<FriendRequestStatus | undefined>
  >;
}) => {
  if (requestInfo == FriendRequestStatus.PENDING) {
    const handleSubmit = async () => {
      toast.loading("Cancelling friend request...");
      const status = await deleteFriend(user.id);
      toast.remove();
      if (status === 200) {
        toast.success("Friend request canceled");
        setRequestInfo(FriendRequestStatus.NO_INTERACTIONS);
        return;
      }

      toast.error("Something went wrong");
    };
    return <Button handleSubmit={handleSubmit} text={"Cancel request"} />;
  }

  if (requestInfo == FriendRequestStatus.ACCEPTED) {
    const handleSubmit = async () => {
      toast.loading("Deleting friend...");
      const status = await deleteFriend(user.id);
      toast.remove();
      if (status === 200) {
        toast.success("Friend deleted");
        setRequestInfo(FriendRequestStatus.NO_INTERACTIONS);
        return;
      }

      toast.error("Something went wrong");
    };
    return <Button handleSubmit={handleSubmit} text={"Remove friend"} />;
  }

  if (requestInfo == FriendRequestStatus.DECLINED) {
    return;
  }

  if (requestInfo == FriendRequestStatus.ACCEPT) {
    const handleAccept = async () => {
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
    };

    const handleDecline = async () => {
      toast.loading("Declining friend request...");
      const status = await deleteFriend(user.id);
      toast.remove();
      if (status === 200) {
        toast.success("Friend request declined");
        setRequestInfo(FriendRequestStatus.NO_INTERACTIONS);
        return;
      }

      toast.error("Something went wrong");
    };
    return (
      <div className="flex space-x-3">
        <Button handleSubmit={handleAccept} text={"Accept"} />
        <Button handleSubmit={handleDecline} text={"Decline"} />
      </div>
    );
  }

  if (requestInfo == FriendRequestStatus.NO_INTERACTIONS) {
    const handleAddFriend = async () => {
      toast.loading("Adding friend...");
      const res = await addFriendRequest(user.id);
      toast.remove();
      if (!res.error) {
        toast.success("Friend request sent");
        setRequestInfo(FriendRequestStatus.PENDING);
        return;
      }
      toast.error(res.message);
    };
    return <Button handleSubmit={handleAddFriend} text={"Add friend"} />;
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
  const [userId, setUserId] = useState<string | null>(null);
  const [requestInfo, setRequestInfo] = useState<
    FriendRequestStatus | undefined
  >();
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

            {userId && !loading ? (
              +userId === user?.id ? (
                <Link
                  type="button"
                  href={`/settings`}
                  className="border-text h-23 flex w-auto cursor-pointer items-center justify-center rounded-sm border-2 border-blue-300 px-2 py-2 text-sm font-bold capitalize leading-6 transition-colors hover:border-blue-500 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-10"
                >
                  Edit Profile
                </Link>
              ) : (
                <ButtonLogic
                  requestInfo={requestInfo}
                  user={user}
                  setRequestInfo={setRequestInfo}
                />
              )
            ) : (
              <button
                type="button"
                disabled
                className="border-text h-23 flex w-auto cursor-pointer items-center justify-center rounded-sm border-2 border-blue-300 px-2 py-2 text-sm font-bold capitalize leading-6"
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
            id="sort"
            defaultValue="new"
            {...register("sortBy")}
          >
            <option value="new">New</option>
            <option value="old">Old</option>
          </select>
        </div>

        <ul role="list">
          {user && (
            <InfiniteScrollPostsProfile
              posts={renderPosts}
              setRenderPosts={setRenderPosts}
              hasNextPage={hasNextPage}
              nextCursor={nextCursor}
              postsLength={postsLength}
              sortBy={sortBy}
              userId={user.id}
            />
          )}
        </ul>
      </div>
    </section>
  );
};

export default Profile;
