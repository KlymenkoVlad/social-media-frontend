import {
  ChatBubbleOutlineOutlined,
  Favorite,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  MoreHoriz,
  Reply,
  ReplyOutlined,
} from "@mui/icons-material";
import Image from "next/image";
import React from "react";
import BlankAvatar from "./BlankAvatar";

interface PostProps {
  likesCount: number;
  sharedCount: number;
  commentsCount: number;
  name: string;
  date: string;
  imageSrc?: string;
}

const Post = ({
  likesCount,
  commentsCount,
  sharedCount,
  name,
  date,
  imageSrc,
}: PostProps) => {
  return (
    <div className="w-full overflow-auto bg-white mb-20 p-5 justify-between space-y-4 rounded-md">
      <div className="flex">
        <div className="flex items-center w-full">
          <BlankAvatar />
          <div className="ml-3">
            <p className="font-medium ">{name}</p>
            <p className=" text-xs">{date}</p>
          </div>
        </div>

        <div className="flex justify-center items-center rounded-full hover:bg-gray-200 transition-colors cursor-pointer w-8 h-8">
          <MoreHoriz />
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

      <div className="flex">
        <div className="bg-gray-100 rounded-2xl w-20 h-8 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors">
          <FavoriteBorderOutlined className="w-5 h-5" />
          <p className="ml-1 text-sm text-gray-700 font-medium">{likesCount}</p>
        </div>
        <div className="ml-3 bg-gray-100 rounded-2xl w-20 h-8 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors">
          <ChatBubbleOutlineOutlined className="w-5 h-5" />
          <p className="ml-1 text-sm text-gray-700 font-medium">
            {commentsCount}
          </p>
        </div>
        <div className="ml-3 bg-gray-100 rounded-2xl w-20 h-8 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors">
          <ReplyOutlined className="w-5 h-5 " />
          <p className="ml-1 text-sm text-gray-700 font-medium">
            {sharedCount}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Post;
