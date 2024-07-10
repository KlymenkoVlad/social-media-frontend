"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import BlankAvatar from "../BlankAvatar";
import { dateFormat } from "@/utils/dateFormat";
import { ILike, IComment } from "@/interfaces/post";
import PostInteractions from "./PostInteractions";
import { MdMoreHoriz } from "react-icons/md";
import { ICommunity, ISubscription } from "@/interfaces/community";
import Link from "next/link";

interface PostProps {
  likes: ILike[];
  comments: IComment[];
  title?: string;
  userId: number;
  text: string;
  date: Date;
  imageSrc?: string;
  username: string;
  postId: number;
  userImage: string | null;
  community: ICommunity;
}

const Post = ({
  likes,
  comments,
  title,
  text,
  date,
  imageSrc,
  username,
  postId,
  userImage,
  community,
  userId,
}: PostProps) => {
  const [formattedDate, setFormattedDate] = useState<string>();
  const [isSubscribed, setIsSubscribed] = useState<boolean>();

  useEffect(() => {}, []);

  useEffect(() => {
    setFormattedDate(dateFormat(date));
  }, []);

  useEffect(() => {
    if (community?.subscribed?.length > 0) {
      const id = localStorage.getItem("userId");
      if (!id) return;
      setIsSubscribed(community.subscribed.some((sub) => sub.userId === +id));
    }
  }, []);

  return (
    <div
      key={postId}
      className={`mb-5 w-full justify-between space-y-4 overflow-auto rounded-md ${isSubscribed ? "border-2" : "border-0"} border-blue-400 bg-white p-5`}
    >
      <div>
        <div className="flex">
          <Link
            className="flex w-full items-center rounded-md p-1 transition-colors hover:bg-gray-100"
            href={
              community ? `/communities/${community.id}` : `/profile/${userId}`
            }
          >
            <BlankAvatar imageSrc={community?.imageUrl || userImage} />
            <div className="ml-3">
              {community ? (
                <span>
                  {community.name[0].toUpperCase() + community.name.slice(1)}{" "}
                  (created by{" "}
                  <span className="font-semibold">
                    {username[0].toUpperCase() + username.slice(1)}
                  </span>
                  )
                </span>
              ) : (
                username && username[0].toUpperCase() + username.slice(1)
              )}

              <p className="text-xs">
                {formattedDate ? (
                  formattedDate
                ) : (
                  <span className="animate-pulse">Loading...</span>
                )}
              </p>
            </div>
          </Link>

          <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-gray-200">
            <MdMoreHoriz />
          </div>
        </div>

        <div className="mt-3">
          <p className="font-medium">{title && title}</p>
          <p className="mt-3">{text && text}</p>
        </div>
      </div>

      {imageSrc && (
        <Image
          src={imageSrc}
          className="h-full min-w-full max-w-full rounded-sm"
          width={500000}
          height={500000}
          alt="image"
        />
      )}

      <PostInteractions
        likes={likes}
        comments={comments}
        postId={postId}
        userImage={userImage}
      />
    </div>
  );
};

export default Post;
