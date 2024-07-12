"use server";

import { baseUrl } from "@/utils/baseUrl";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export const sendComment = async (text: string, postId: number) => {
  const cookiesStore = cookies();
  const token = cookiesStore.get("token")?.value;

  const response = await fetch(`${baseUrl}/post/comment/${postId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text }),
  }).then((res) => res.json());

  if (!response.error) {
    revalidateTag("posts");
  }

  return response;
};

export const likePost = async (postId: number) => {
  const cookiesStore = cookies();
  const token = cookiesStore.get("token")?.value;

  await fetch(`${baseUrl}/post/like/${postId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
