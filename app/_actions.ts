"use server";

import { PasswordFormInputs } from "@/app/(pages)/settings/PasswordForm";
import { ProfileFormInputs } from "@/app/(pages)/settings/ProfileForm";
import { baseUrl } from "@/utils/baseUrl";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { z } from "zod";
import { FriendRequestStatus } from "./profile/[id]/_components/Profile";

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

export const sendData = async (
  data: InputsLogin | InputsSignup,
  url: string,
) => {
  let result;
  const cookiesStore = cookies();

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

  const user = await fetch(`${baseUrl}/user/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${response.token}`,
    },
  }).then((res) => res.json());

  if (response?.token?.length > 0) {
    cookiesStore.set("token", response.token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 14 * 24 * 60 * 60 * 1000,
    });
  }

  return { response, user };
};

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

export const revalidatePostsByUserId = async () => {
  revalidateTag("postsByUserId");
};

export const sendComment = async (text: string, postId: number) => {
  const cookiesStore = cookies();
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
  imageUrl?: string,
) => {
  const cookiesStore = cookies();
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

export const getUser = async (id: number) => {
  const token = cookies().get("token")?.value;
  const res = await fetch(`${baseUrl}/user/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());

  return res.user;
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

export const revalidateFriendsRecommendations = () => {
  revalidateTag("friendsRecommendations");
};
