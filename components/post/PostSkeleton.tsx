import BlankAvatar from "@/components/BlankAvatar";
import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  MoreHoriz,
} from "@mui/icons-material";
import React, { Ref, forwardRef } from "react";
import PostInteractions from "./PostInteractions";

type typeRef = Element | null | undefined;

//TODO remove any type

const PostSkeleton = forwardRef(
  (props: { end: boolean }, ref: Ref<HTMLUListElement>) => {
    return (
      <ul
        ref={ref}
        className={`${
          props.end ? "hidden" : "block"
        } mb-5 w-full animate-pulse justify-between space-y-4 overflow-auto rounded-md bg-white p-5`}
      >
        <div className="">
          <div className="flex">
            <div className="flex w-full items-center">
              <div className="relative flex h-10 w-10 items-start justify-center overflow-hidden rounded-full bg-gray-300"></div>
              <div className="ml-3 w-16 space-y-2">
                <div className="h-2 w-full rounded bg-gray-300"></div>
                <div className="h-2 w-full rounded bg-gray-300"></div>
              </div>
            </div>

            <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors">
              <MoreHoriz />
            </div>
          </div>

          <div className="mt-3">
            <div className="h-2 w-1/2 rounded bg-gray-300"></div>

            <div className="mt-3 space-y-2">
              <div className="h-2 w-full rounded bg-gray-300"></div>
              <div className="h-2 w-full rounded bg-gray-300"></div>
              <div className="h-2 w-full rounded bg-gray-300"></div>
              <div className="h-2 w-full rounded bg-gray-300"></div>
            </div>
          </div>
        </div>
        <div className="h-80 w-full rounded-md bg-gray-300"></div>
        <div className="flex">
          <button
            disabled
            className="flex h-8 w-20 cursor-pointer items-center justify-center rounded-2xl bg-gray-100 transition-colors"
          >
            <FavoriteBorderOutlined className="h-5 w-5" />
          </button>
          <button
            disabled
            className="ml-3 flex h-8 w-20 cursor-pointer items-center justify-center rounded-2xl bg-gray-100 transition-colors"
          >
            <ChatBubbleOutlineOutlined className="h-5 w-5" />
          </button>
        </div>
      </ul>
    );
  },
);

PostSkeleton.displayName = "PostSkeleton";

export default PostSkeleton;
