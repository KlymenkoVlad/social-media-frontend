"use server";

import { baseUrl } from "@/utils/baseUrl";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export const getAllPosts = async (
  cursor?: number,
  sortBy = "new",
  take = 4,
) => {
  const token = cookies().get("token")?.value;

  const res = await fetch(
    `${baseUrl}/post?sortBy=${sortBy}&cursor=${cursor}&take=${take}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      next: { tags: ["posts"] },
    },
  );

  const data = await res.json();

  return data;
};

export const getPostsByUserId = async (
  id: number,
  sortBy = "new",
  cursor?: number | null,
  take = 4,
) => {
  const token = cookies().get("token")?.value;

  const res = await fetch(
    `${baseUrl}/post/user/${id}?sortBy=${sortBy}&cursor=${cursor}&take=${take}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      next: { tags: ["postsByUserId"] },
    },
  );

  const data = await res.json();

  return data;
};

export const findPosts = async (text: string, cursor?: number, take = 4) => {
  const token = cookies().get("token")?.value;

  const res = await fetch(
    `${baseUrl}/post/search/${text}?cursor=${cursor}&take=${take}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  ).then((res) => res.json());

  return res;
};

export const sendPost = async (
  text: string,
  title?: string,
  imageUrl?: string,
  communityId?: number,
) => {
  const cookiesStore = cookies();
  const token = cookiesStore.get("token")?.value;

  const response = await fetch(`${baseUrl}/post`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text, title, imageUrl, communityId }),
  }).then((res) => res.json());

  if (!response.error) {
    revalidateTag("posts");
  }

  return response;
};

export const revalidatePostsByUserId = async () => {
  revalidateTag("postsByUserId");
};
