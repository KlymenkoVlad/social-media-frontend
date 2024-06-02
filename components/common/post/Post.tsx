"use client";

import { MoreHoriz } from "@mui/icons-material";
import Image from "next/image";
import React, { useState } from "react";
import BlankAvatar from "../BlankAvatar";
import { dateFormat } from "@/utils/dateFormat";
import { ILike, IComment } from "@/interfaces/post";
import PostInteractions from "./PostInteractions";

interface PostProps {
  likes: ILike[];
  comments: IComment[];
  title?: string;
  text: string;
  date: Date;
  imageSrc?: string;
  username: string;
  postId: number;
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
}: PostProps) => {
  const formattedDate = dateFormat(date);

  return (
    <ul className="w-full overflow-auto bg-white mb-5 p-5 justify-between space-y-4 rounded-md">
      <div>
        <div className="flex">
          <div className="flex items-center w-full">
            <BlankAvatar />
            <div className="ml-3">
              <p>{username[0].toUpperCase() + username.slice(1)}</p>
              <p className=" text-xs">{formattedDate}</p>
            </div>
          </div>

          <div className="flex justify-center items-center rounded-full hover:bg-gray-200 transition-colors cursor-pointer w-8 h-8">
            <MoreHoriz />
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
          className="min-w-full max-w-full h-full rounded-sm"
          width={100}
          height={100}
          quality={100}
          alt="image"
        />
      )}

      <PostInteractions likes={likes} comments={comments} postId={postId} />
    </ul>
  );
};

export default Post;
