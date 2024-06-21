"use client";

import Image from "next/image";
import React from "react";
import BlankAvatar from "../BlankAvatar";
import { dateFormat } from "@/utils/dateFormat";
import { ILike, IComment } from "@/interfaces/post";
import PostInteractions from "./PostInteractions";
import { MdMoreHoriz } from "react-icons/md";

interface PostProps {
  likes: ILike[];
  comments: IComment[];
  title?: string;
  text: string;
  date: Date;
  imageSrc?: string;
  username: string;
  postId: number;
  userImage: string | null;
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
}: PostProps) => {
  const formattedDate = dateFormat(date);

  return (
    <ul className="mb-5 w-full justify-between space-y-4 overflow-auto rounded-md bg-white p-5">
      <div>
        <div className="flex">
          <div className="flex w-full items-center">
            <BlankAvatar imageSrc={userImage} />
            <div className="ml-3">
              <p>{username[0].toUpperCase() + username.slice(1)}</p>
              <p className="text-xs">{formattedDate}</p>
            </div>
          </div>

          <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-gray-200">
            <MdMoreHoriz />
          </div>
        </div>

        <div className="mt-3">
          <p className="font-medium">{title}</p>
          <p className="mt-3">{text}</p>
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

      {/* <PostInteractions
        likes={likes}
        comments={comments}
        postId={postId}
        userImage={userImage}
      /> */}
    </ul>
  );
};

export default Post;
