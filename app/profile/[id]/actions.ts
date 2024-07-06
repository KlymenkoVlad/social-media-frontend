"use server";

import { FormCommunityInputs } from "@/app/(pages)/communities/edit/FormCommunityEdit";
import { Colors } from "@/interfaces/user";
import { baseUrl } from "@/utils/baseUrl";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export const getDataAuth = async (url: string) => {
  const cookiesStore = cookies();
  const token = cookiesStore.get("token")?.value;

  const res = await fetch(`${baseUrl}/${url}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());

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

export const updateColor = async (color: Colors) => {
  const token = cookies().get("token")?.value;

  const res = await fetch(`${baseUrl}/user/color`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ color }),
  });

  return res.status;
};

export const isCommunityExist = async (): Promise<boolean> => {
  const token = cookies().get("token")?.value;

  const res = await fetch(`${baseUrl}/community/exist`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());

  return res.status;
};

export const updateCommunity = async (data: FormCommunityInputs) => {
  (Object.keys(data) as (keyof typeof data)[]).forEach((key) => {
    if (data[key] === undefined) {
      delete data[key];
    }
  });

  if (Object.keys(data).length === 0 && data.constructor === Object) {
    return {
      statusCode: 304,
      message: "No changes were made",
    };
  }

  console.log(data);

  const token = cookies().get("token")?.value;
  const res = await fetch(`${baseUrl}/community`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (res.status === 409) {
    const data: {
      message: string;
      error: string;
      statusCode: 409;
    } = await res.json();
    return data;
  }
  return {
    statusCode: res.status,
    message: "Profile updated successfully",
  };
};
