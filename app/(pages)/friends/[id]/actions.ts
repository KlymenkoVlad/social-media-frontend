"use server";

import { baseUrl } from "@/utils/baseUrl";
import { cookies } from "next/headers";

export const getAllFriends = async (
  id: number | string,
  cursor?: number | null,
  take = 5,
) => {
  const token = cookies().get("token")?.value;

  const res = await fetch(
    `${baseUrl}/friend/all/${id}?cursor=${cursor}&take=${take}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { tags: ["friendsList"] },
    },
  ).then((res) => res.json());

  return res;
};
