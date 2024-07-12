"use server";

import { FriendRequestStatus } from "@/app/profile/[id]/_components/Profile";
import { baseUrl } from "@/utils/baseUrl";
import { revalidateTag } from "next/cache";
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

export const getFriendsList = async (userId: string) => {
  const token = cookies().get("token")?.value;

  const res = await fetch(`${baseUrl}/friend/${userId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    next: { tags: ["friendsList"] },
  }).then((res) => res.json());

  return res;
};

export const revalidateFriendsList = async () => {
  await revalidateTag("friendsList");
};

export const deleteFriend = async (id: number) => {
  const token = cookies().get("token")?.value;

  const friendRequest = await fetch(`${baseUrl}/friend/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return friendRequest.status;
};

export const getFriendsRecommendations = async () => {
  const token = cookies().get("token")?.value;

  const res = await fetch(`${baseUrl}/user/recommendations`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    next: { tags: ["friendsRecommendations"] },
  }).then((res) => res.json());

  return res;
};

export const addFriendRequest = async (id: number) => {
  const token = cookies().get("token")?.value;

  const friendRequest = await fetch(`${baseUrl}/request/send/${id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());

  return friendRequest;
};

export const getRequestInfo = async (id: number) => {
  const token = cookies().get("token")?.value;

  const requestInfo = await fetch(`${baseUrl}/request/status/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());

  return requestInfo.status;
};

export const changeRequestStatus = async (
  id: number,
  newStatus: FriendRequestStatus,
) => {
  const token = cookies().get("token")?.value;

  const request = await fetch(`${baseUrl}/request/accept/${id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json", // Added Content-Type header
    },
    body: JSON.stringify({
      newStatus,
    }),
  }).then((res) => res.json());

  return request;
};

export const getAllRequestsToMe = async () => {
  const token = cookies().get("token")?.value;

  const res = await fetch(`${baseUrl}/request`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());

  return res;
};

export const revalidateFriendsRecommendations = () => {
  revalidateTag("friendsRecommendations");
};
