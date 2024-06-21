"use client";

import { IComment } from "@/interfaces/post";
import React, { useEffect, useState } from "react";
import BlankAvatar from "../BlankAvatar";
import { dateFormat } from "@/utils/dateFormat";

const Comment = ({ comment }: { comment: IComment }) => {
  const [formattedDate, setFormattedDate] = useState<string>();

  useEffect(() => {
    setFormattedDate(dateFormat(comment.created_at));
  }, []);

  return (
    <div key={comment.id}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center space-x-5">
          <BlankAvatar imageSrc={comment.user.image_url} />
          <div>
            <p className="font-semibold">{comment.user.username}</p>
            <p>{comment.text}</p>
          </div>
        </div>

        <p className="text-xs text-gray-500">{formattedDate}</p>
      </div>
    </div>
  );
};

export default Comment;
