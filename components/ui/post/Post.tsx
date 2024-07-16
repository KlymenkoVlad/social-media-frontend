"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import BlankAvatar from "../BlankAvatar";
import { dateFormat } from "@/utils/dateFormat";
import { IPost } from "@/interfaces/post";
import PostInteractions from "./PostInteractions";
import { MdMoreHoriz } from "react-icons/md";
import Link from "next/link";

const Post = (post: IPost) => {
  const [formattedDate, setFormattedDate] = useState<string>();
  const [isSubscribed, setIsSubscribed] = useState<boolean>();

  useEffect(() => {}, []);

  useEffect(() => {
    setFormattedDate(dateFormat(post.createdAt));
  }, []);

  useEffect(() => {
    if (post.community?.subscribed?.length > 0) {
      const id = localStorage.getItem("userId");
      if (!id) return;
      setIsSubscribed(
        post.community.subscribed.some((sub) => sub.userId === +id),
      );
    }
  }, []);

  return (
    <div
      key={post.id}
      className={`mb-5 w-full justify-between space-y-4 overflow-auto rounded-md ${isSubscribed ? "border" : "border-0"} border-blue-400 bg-white p-5`}
    >
      <div>
        <div className="flex">
          <Link
            className="flex w-full items-center rounded-md p-1 transition-colors hover:bg-gray-100"
            href={
              post.community
                ? `/communities/${post.community.id}`
                : `/profile/${post.userId}`
            }
          >
            <BlankAvatar
              imageSrc={post.community?.imageUrl || post.user.imageUrl}
            />
            <div className="ml-3">
              {post.community ? (
                <span>
                  {post.community.name[0].toUpperCase() +
                    post.community.name.slice(1)}{" "}
                  (created by{" "}
                  <span className="font-semibold">
                    {post.user.username[0].toUpperCase() +
                      post.user.username.slice(1)}
                  </span>
                  )
                </span>
              ) : (
                post.user.username &&
                post.user.username[0].toUpperCase() +
                  post.user.username.slice(1)
              )}

              {formattedDate ? (
                <p className="text-xs">{formattedDate}</p>
              ) : (
                <div className="h-4 w-16 animate-pulse rounded-lg bg-gray-300"></div>
              )}
            </div>
          </Link>

          <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-gray-200">
            <MdMoreHoriz />
          </div>
        </div>

        <div className="mt-3">
          <p className="font-medium">{post.title && post.title}</p>
          <p className="mt-3">{post.text}</p>
        </div>
      </div>

      {post.imageUrl && (
        <Image
          src={post.imageUrl}
          className="h-full max-h-[500px] rounded-sm"
          width={500000}
          height={500000}
          alt="image"
        />
      )}

      <PostInteractions
        likes={post.likes}
        comments={post.comments}
        postId={post.id}
        userImage={post.user.imageUrl}
        isSubscribed={isSubscribed}
      />
    </div>
  );
};

export default Post;
