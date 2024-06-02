import BlankAvatar from "@/components/common/BlankAvatar";
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
        } w-full overflow-auto bg-white mb-5 p-5 justify-between space-y-4 rounded-md animate-pulse`}
      >
        <div className="">
          <div className="flex">
            <div className="flex items-center w-full">
              <div className="rounded-full bg-gray-300 h-10 w-10 relative overflow-hidden justify-center items-start flex"></div>
              <div className="ml-3 w-16 space-y-2">
                <div className="h-2 bg-gray-300 rounded w-full"></div>
                <div className="h-2 bg-gray-300 rounded w-full"></div>
              </div>
            </div>

            <div className="flex justify-center items-center rounded-full transition-colors cursor-pointer w-8 h-8">
              <MoreHoriz />
            </div>
          </div>

          <div className="mt-3">
            <div className="h-2 bg-gray-300 rounded w-1/2"></div>

            <div className="mt-3 space-y-2">
              <div className="h-2 bg-gray-300 rounded w-full"></div>
              <div className="h-2 bg-gray-300 rounded w-full"></div>
              <div className="h-2 bg-gray-300 rounded w-full"></div>
              <div className="h-2 bg-gray-300 rounded w-full"></div>
            </div>
          </div>
        </div>
        <div className="rounded-md w-full h-80 bg-gray-300"></div>
        <div className="flex">
          <button
            disabled
            className="bg-gray-100 rounded-2xl w-20 h-8 flex items-center justify-center cursor-pointer transition-colors"
          >
            <FavoriteBorderOutlined className="w-5 h-5" />
          </button>
          <button
            disabled
            className="ml-3 bg-gray-100 rounded-2xl w-20 h-8 flex items-center justify-center cursor-pointer transition-colors"
          >
            <ChatBubbleOutlineOutlined className="w-5 h-5" />
          </button>
        </div>
      </ul>
    );
  }
);

PostSkeleton.displayName = "PostSkeleton";

export default PostSkeleton;
