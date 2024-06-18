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
import { IFriend } from "@/interfaces/friend";
import { getFriendsList } from "../actions";
import PersonProfile from "./Person";

const btnStyle =
  "border-text mb-3 flex h-fit min-w-32 cursor-pointer items-center justify-center self-end rounded-sm border-2 border-blue-300 bg-blue-100 px-1 py-2 ms:p-2 text-sm font-bold capitalize leading-6 transition-colors hover:border-blue-500 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-10";

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
  <button onClick={handleSubmit} className={btnStyle}>
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
  const [friends, setFriends] = useState<IFriend[]>();
  const [friendsLoading, setFriendsLoading] = useState(true);

  useEffect(() => {
    const getFriends = async () => {
      const userId = localStorage.getItem("userId");
      setFriendsLoading(true);
      if (!userId) return;
      const res: IFriend[] = await getFriendsList(userId);

      console.log(res);
      setFriends(res);
      setFriendsLoading(false);
    };

    getFriends();
  }, []);

  useEffect(() => {
    setUserId(localStorage.getItem("userId"));

    const fetchCurrentUserInfo = async () => {
      setLoading(true);
      const res: FriendRequestStatus = await getRequestInfo(user.id);

      setRequestInfo(res);
      setLoading(false);
    };

    fetchCurrentUserInfo();
  }, []);

  const { register, watch } = useForm();

  const sortBy = watch("sortBy") || "new";

  return (
    <section className="h-full w-full space-y-5 px-1 md:px-5">
      <div className="relative flex h-[300px] w-full items-center justify-between overflow-hidden rounded-md bg-gray-300">
        <div className="absolute bottom-0 z-0 flex h-2/5 w-full rounded-md bg-white">
          <div className="absolute bottom-[60px] flex w-full justify-between px-1.5 ms:px-4 sm:px-2 md:px-6">
            <div className="flex w-full space-x-1 sm:space-x-4">
              <div className="flex h-28 w-28 items-start justify-center overflow-hidden rounded-full border-4 border-white bg-gray-200 ms:h-36 ms:w-36">
                {user?.image_url ? (
                  <Image
                    width={100}
                    height={100}
                    alt="Profile Photo"
                    src={user?.image_url}
                    className="h-full w-full rounded-full"
                  />
                ) : (
                  <Person
                    className="text-gray-400 sm:h-44 sm:w-44"
                    style={{ width: "120%", height: "120%" }}
                  />
                )}
              </div>

              <div className="mb-3 flex items-center justify-between self-end">
                <div>
                  <h1 className="font-semibold">
                    {user?.name} {user?.surname}{" "}
                    {user?.age && `| ${user?.age} years`}
                  </h1>
                  <h2 className="text-gray-500">@{user?.username}</h2>
                </div>
              </div>
            </div>

            {userId && !loading ? (
              +userId === user?.id ? (
                <Link type="button" href={`/settings`} className={btnStyle}>
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
              <button type="button" disabled className={btnStyle}>
                Loading...
              </button>
            )}
          </div>
          <p className="absolute bottom-1 left-1">
            {user?.description || "No description specified"}
          </p>
        </div>
      </div>

      {/* Friends List */}

      <div className="block h-fit min-w-60 rounded-md bg-white p-5 lg:hidden">
        <h2 className="mb-6 text-center text-xl font-semibold">Friends List</h2>
        <ul className="mb-8 space-y-4">
          {friendsLoading ? (
            <p>loading...</p>
          ) : friends && friends?.length > 0 ? (
            friends
              ?.slice(0, 6)
              ?.map((friend) => (
                <PersonProfile
                  username={friend.friend.username}
                  name={friend.friend.name}
                  imageSrc={friend.friend.image_url}
                  friendId={friend.friendId}
                  key={friend.id}
                />
              ))
          ) : (
            <p>No friends</p>
          )}
        </ul>
        {friends && friends?.length > 6 && (
          <Link
            type="button"
            href={`/friends/${userId}`}
            className="grid h-7 w-full items-center rounded-full bg-blue-100 text-center text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            Show all
          </Link>
        )}
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
