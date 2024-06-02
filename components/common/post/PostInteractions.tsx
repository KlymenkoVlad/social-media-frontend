"use client";

import { IComment, ILike } from "@/interfaces/post";
import { baseUrl } from "@/utils/baseUrl";
import {
  ChatBubbleOutlineOutlined,
  Favorite,
  FavoriteBorderOutlined,
  Send,
} from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import BlankAvatar from "../BlankAvatar";
import { dateFormat } from "@/utils/dateFormat";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendComment } from "@/app/_actions";
import toast from "react-hot-toast";

interface LikeProps {
  postId: number;
  likes: ILike[] | [];
  comments: IComment[] | [];
}

const PostInteractions = ({ likes, postId, comments }: LikeProps) => {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likesAmount, setLikesAmount] = useState<number>(likes.length);
  const [renderComments, setRenderComments] = useState(comments);

  const [commentsAmount, setCommentsAmount] = useState(3);

  const [showComments, setShowComments] = useState(comments.length > 0);
  const token = Cookies.get("token");

  const FormDataSchema = z.object({
    text: z.string().min(1, "Comment cannot be empty"),
  });

  type Inputs = z.infer<typeof FormDataSchema>;

  const { register, handleSubmit, reset } = useForm<Inputs>({
    resolver: zodResolver(FormDataSchema),
  });

  const processForm: SubmitHandler<Inputs> = async (data) => {
    toast.loading("Posting your comment...");
    const result = await sendComment(data.text, postId);
    toast.remove();
    if (result.error) {
      toast.error("Something went wrong");
    } else {
      setRenderComments([result, ...renderComments]);
      toast.success("Comment posted");
      reset();
    }
  };

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.localStorage &&
      likes.length > 0
    ) {
      const userId = localStorage.getItem("userId") || "";

      const isLiked =
        likes.length > 0 && likes.some((like) => like.user_id === +userId);

      setIsLiked(isLiked);
    }
  }, []);

  const likePost = async (postId: number) => {
    if (isLiked) {
      setLikesAmount(likesAmount - 1);
    } else {
      setLikesAmount(likesAmount + 1);
    }
    if (token) {
      await fetch(`${baseUrl}/post/like/${postId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  };

  return (
    <div>
      <div className="flex">
        <button
          onClick={() => {
            setIsLiked(!isLiked);
            likePost(postId);
          }}
          className="bg-gray-100 rounded-2xl w-20 h-8 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors"
        >
          {isLiked ? (
            <Favorite className="w-5 h-5" />
          ) : (
            <FavoriteBorderOutlined className="w-5 h-5" />
          )}
          <p className="ml-1 text-sm text-gray-700 font-medium">
            {likesAmount}
          </p>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="ml-3 bg-gray-100 rounded-2xl w-20 h-8 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors"
        >
          <ChatBubbleOutlineOutlined className="w-5 h-5" />
          <p className="ml-1 text-sm text-gray-700 font-medium">
            {comments.length}
          </p>
        </button>
      </div>

      <div className={`mt-3 ${showComments ? "block" : "hidden"}`}>
        <div className="h-px w-full bg-gray-300 mb-3"></div>

        <div className="mb-5">
          {renderComments?.length > 0 &&
            renderComments.slice(0, commentsAmount).map((comment) => (
              <div key={comment.id}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-5">
                    <BlankAvatar />
                    <div>
                      <p className="font-semibold">{comment.user.username}</p>
                      <p>{comment.text}</p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500">
                    {dateFormat(comment.created_at)}
                  </p>
                </div>
              </div>
            ))}

          {comments.length > commentsAmount && (
            <button
              onClick={() => setCommentsAmount((prev) => prev + 3)}
              className="text-center h-7 align-middle w-full text-blue-600 font-semibold rounded-full text-sm hover:text-blue-700 transition-colors"
            >
              Show more comments
            </button>
          )}
        </div>

        <form
          onSubmit={handleSubmit(processForm)}
          className="flex items-center h-15 space-x-5 "
        >
          <div>
            <BlankAvatar />
          </div>
          <input
            type="text"
            {...register("text")}
            placeholder="Write a comment..."
            className="w-full border-2 focus:outline-none p-4 h-10 rounded-md"
          />
          <button
            type="submit"
            className="text-gray-500 font-semibold hover:text-gray-700"
          >
            <Send />
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostInteractions;
