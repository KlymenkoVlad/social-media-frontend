"use client";

import { IComment, ILike } from "@/interfaces/post";
import { baseUrl } from "@/utils/baseUrl";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import BlankAvatar from "../BlankAvatar";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {
  MdFavorite,
  MdOutlineChatBubbleOutline,
  MdOutlineFavoriteBorder,
  MdSend,
} from "react-icons/md";
import Comment from "./Comment";
import { COMMENTS_SKIP_AMOUNT } from "@/constants/constants";
import { sendComment, likePost } from "@/actions/postInteractions";

interface LikeProps {
  postId: number;
  likes: ILike[] | [];
  comments: IComment[] | [];
  userImage: string | null;
  isSubscribed: boolean | undefined;
}

const PostInteractions = ({
  likes,
  postId,
  comments,
  isSubscribed,
}: LikeProps) => {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likesAmount, setLikesAmount] = useState<number>(likes.length);
  const [renderComments, setRenderComments] = useState(comments);
  const [commentsAmount, setCommentsAmount] = useState(COMMENTS_SKIP_AMOUNT);
  const [showComments, setShowComments] = useState(comments.length > 0);
  const [isCommentSending, setIsCommentSending] = useState(false);

  const token = Cookies.get("token");

  const FormDataSchema = z.object({
    text: z.string().min(1, "Comment cannot be empty").max(500),
  });

  type Inputs = z.infer<typeof FormDataSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(FormDataSchema),
  });

  const processForm: SubmitHandler<Inputs> = async (data) => {
    setIsCommentSending(true);
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
    setIsCommentSending(false);
  };

  useEffect(() => {
    if (likes.length > 0) {
      const userId = localStorage.getItem("userId") || "";

      const isLiked =
        likes.length > 0 && likes.some((like) => like.userId === +userId);

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
      await likePost(postId);
    }
  };

  return (
    <div>
      <div className="flex justify-between">
        <div className="flex">
          <button
            onClick={() => {
              setIsLiked(!isLiked);
              likePost(postId);
            }}
            className="flex h-8 w-20 cursor-pointer items-center justify-center rounded-2xl bg-gray-100 transition-colors hover:bg-gray-300"
          >
            {isLiked ? <MdFavorite /> : <MdOutlineFavoriteBorder />}
            <p className="ml-1 text-sm font-medium text-gray-700">
              {likesAmount}
            </p>
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="ml-3 flex h-8 w-20 cursor-pointer items-center justify-center rounded-2xl bg-gray-100 transition-colors hover:bg-gray-300"
          >
            <MdOutlineChatBubbleOutline />
            <p className="ml-1 text-sm font-medium text-gray-700">
              {comments.length}
            </p>
          </button>
        </div>

        {isSubscribed && (
          <span className="text-sm font-medium text-gray-400">
            From your subscriptions
          </span>
        )}
      </div>

      <div className={`mt-3 ${showComments ? "block" : "hidden"}`}>
        <div className="mb-3 h-px w-full bg-gray-300"></div>

        <div className="mb-5">
          {renderComments?.length > 0 &&
            renderComments
              .slice(0, commentsAmount)
              .map((comment) => <Comment key={comment.id} comment={comment} />)}

          {comments.length > commentsAmount && (
            <button
              onClick={() =>
                setCommentsAmount((prev) => prev + COMMENTS_SKIP_AMOUNT)
              }
              className="h-7 w-full rounded-full text-center align-middle text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
            >
              Show more comments
            </button>
          )}
        </div>

        <form
          onSubmit={handleSubmit(processForm)}
          className="h-15 flex items-center space-x-5"
        >
          <div className="self-start">
            <BlankAvatar />
          </div>
          <textarea
            {...register("text")}
            placeholder="Write a comment..."
            className="max-h-72 min-h-24 w-full rounded-md border-2 p-2 focus:outline-none"
          />
          <button
            type="submit"
            disabled={isCommentSending}
            className="font-semibold text-gray-500 hover:text-gray-700"
          >
            <MdSend />
          </button>
        </form>
        {errors.text && (
          <p className="mt-2 text-red-500">{errors.text.message}</p>
        )}
      </div>
    </div>
  );
};

export default PostInteractions;
