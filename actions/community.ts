"use server";

import { FormCreateCommunityInputs } from "@/app/(pages)/communities/edit/_components/FormCommunityCreate";
import { FormEditCommunityInputs } from "@/app/(pages)/communities/edit/_components/FormCommunityEdit";
import { Colors } from "@/interfaces/user";
import { baseUrl } from "@/utils/baseUrl";
import { cookies } from "next/headers";

export const getCommunities = async (
  cursor?: number | null,
  sortBy = "desc",
  take = 10,
) => {
  const token = cookies().get("token")?.value;

  const res = await fetch(
    `${baseUrl}/community?sortBy=${sortBy}&cursor=${cursor}&take=${take}`,
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

export const getCommunity = async (id: number) => {
  const token = cookies().get("token")?.value;

  const res = await fetch(`${baseUrl}/community/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());

  return res;
};

export const getMyCommunity = async () => {
  const token = cookies().get("token")?.value;

  const res = await fetch(`${baseUrl}/community/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());

  return res;
};

export const updateCommunityColor = async (color: Colors) => {
  const token = cookies().get("token")?.value;

  const res = await fetch(`${baseUrl}/community/color`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ color }),
  });

  return res.status;
};

export const getCommunityPosts = async (
  id: number | string,
  sortBy?: string,
  cursor?: number | null,
  take = 5,
) => {
  const token = cookies().get("token")?.value;

  const res = await fetch(
    `${baseUrl}/post/community/${id}?cursor=${cursor}&take=${take}&sortBy=${sortBy}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  ).then((res) => res.json());

  return res;
};

export const createCommunity = async (data: FormCreateCommunityInputs) => {
  const token = cookies().get("token")?.value;

  const res = await fetch(`${baseUrl}/community`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());

  return res;
};

export const isCommunityExist = async (): Promise<number> => {
  const token = cookies().get("token")?.value;

  const res = await fetch(`${baseUrl}/community/exist`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());

  return res.id;
};

export const updateCommunity = async (data: FormEditCommunityInputs) => {
  const token = cookies().get("token")?.value;

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
