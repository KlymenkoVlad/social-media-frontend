"use server";

import { Colors } from "@/interfaces/user";
import { baseUrl } from "@/utils/baseUrl";
import { cookies } from "next/headers";
import { FormCommunityInputs } from "./edit/FormCommunity";

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

export const updateColor = async (color: Colors) => {
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

export const createCommunity = async (data: FormCommunityInputs) => {
  const token = cookies().get("token")?.value;

  console.log(data);

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
