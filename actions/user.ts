"use server";

import { PasswordFormInputs } from "@/app/(pages)/settings/_components/PasswordForm";
import { ProfileFormInputs } from "@/app/(pages)/settings/_components/ProfileForm";
import { Colors, User } from "@/interfaces/user";
import { baseUrl } from "@/utils/baseUrl";
import { cookies } from "next/headers";

export const getMe = async () => {
  const token = cookies().get("token")?.value;

  const res = await fetch(`${baseUrl}/user/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());

  return res;
};

export const getUser = async (
  id: number,
): Promise<{ status: string; user: User }> => {
  const token = cookies().get("token")?.value;
  const res = await fetch(`${baseUrl}/user/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());

  return res;
};

export const findUserByUsername = async (
  username: string,
  cursor?: number,
  take = 16,
) => {
  const token = cookies().get("token")?.value;

  const res = await fetch(
    `${baseUrl}/user/username/${username}?cursor=${cursor}&take=${take}`,
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

export const updateUserProfile = async (data: ProfileFormInputs) => {
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

  const token = cookies().get("token")?.value;
  const res = await fetch(`${baseUrl}/user`, {
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

export const updatePassword = async (data: PasswordFormInputs) => {
  const token = cookies().get("token")?.value;
  const res = await fetch(`${baseUrl}/user/password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (res.status === 400) {
    const data: { message: string; error: string; statusCode: 400 } =
      await res.json();

    return data;
  }

  return {
    statusCode: res.status,
    message: "Password updated successfully",
  };
};

export const updateProfileColor = async (color: Colors) => {
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
