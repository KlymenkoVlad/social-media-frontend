"use server";

import { baseUrl } from "@/utils/baseUrl";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { z } from "zod";

const FormDataSchemaLogin = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(5, "Password must be at least 5 characters"),
});

const FormDataSchemaSignup = z.object({
  email: z.string().email("Invalid email"),
  name: z.string().min(1, "Name is required"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .toLowerCase(),
  password: z.string().min(5, "Password must be at least 5 characters"),

  // surname: z.string().nullable(),

  // age: z.number().nullable(),

  // imageUrl: z.string().nullable(),

  // description: z.string().nullable(),
});

type InputsLogin = z.infer<typeof FormDataSchemaLogin>;
type InputsSignup = z.infer<typeof FormDataSchemaSignup>;

const cookiesStore = cookies();

export const sendData = async (
  data: InputsLogin | InputsSignup,
  url: string
) => {
  let result;

  if ("name" in data) {
    result = await FormDataSchemaSignup.safeParseAsync(data);
  } else {
    result = await FormDataSchemaLogin.safeParseAsync(data);
  }

  const response = await fetch(`${baseUrl}/${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(result.data),
  }).then((res) => res.json());

  const { user } = await fetch(`${baseUrl}/user/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${response.token}`,
    },
  }).then((res) => res.json());

  cookiesStore.set("token", response.token);

  return { response, user };
};

export const getPosts = async (cursor?: number, take = 3) => {
  const cookiesStore = cookies();
  const token = cookiesStore.get("token")?.value;

  const res = await fetch(`${baseUrl}/post?cursor=${cursor}&take=${take}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    next: { tags: ["posts"] },
  });

  const data = await res.json();

  return data;
};

export const sendComment = async (text: string, postId: number) => {
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

export const sendPost = async (
  text: string,
  title?: string,
  imageUrl?: string
) => {
  const token = cookiesStore.get("token")?.value;

  const response = await fetch(`${baseUrl}/post`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text, title, imageUrl }),
  }).then((res) => res.json());

  if (!response.error) {
    revalidateTag("posts");
  }

  return response;
};

// export const createImage = async (file: File) => {
//   console.log(file);
// };

// export const getPosts = async (url: string) => {
//   const cookiesStore = cookies();
//   const token = cookiesStore.get("token")?.value;

//   const res = await fetch(`${baseUrl}/${url}`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     next: { tags: ["posts"] },
//   });

//   const data = await res.json();
//   return data;
// };
