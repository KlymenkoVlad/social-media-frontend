"use server";

import { SignInInputs } from "@/app/(auth)/signin/page";
import { SignupInputs } from "@/app/(auth)/signup/page";
import { User } from "@/interfaces/user";
import { baseUrl } from "@/utils/baseUrl";
import { cookies } from "next/headers";

const getUserData = async (res: any): Promise<User> => {
  const cookiesStore = cookies();

  const user: User = await fetch(`${baseUrl}/user/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${res.token}`,
    },
  }).then((res) => res.json());

  if (res?.token?.length > 0) {
    cookiesStore.set("token", res.token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 14 * 24 * 60 * 60 * 1000,
    });
  }

  return user;
};

export const login = async (data: SignInInputs) => {
  const res = await fetch(`${baseUrl}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());

  const user = await getUserData(res);

  return { res, user };
};

export const signup = async (data: SignupInputs) => {
  const res = await fetch(`${baseUrl}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());

  const user = await getUserData(res);

  return { res, user };
};
