"use server";

import { baseUrl } from "@/utils/baseUrl";
import { cookies } from "next/headers";

export const subscribe = async (id: number) => {
  const token = cookies().get("token")?.value;

  const res = await fetch(`${baseUrl}/subscription/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());

  return res;
};

export const unsubscribe = async (id: number) => {
  const token = cookies().get("token")?.value;

  const res = await fetch(`${baseUrl}/subscription/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());

  return res;
};
