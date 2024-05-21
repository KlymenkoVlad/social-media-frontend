"use server";

import { baseUrl } from "@/utils/baseUrl";
import { cookies } from "next/headers";
import { z } from "zod";

const FormDataSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(5, "Password must be at least 5 characters"),
});

const FormDataSchemaSignup = z.object({
  email: z.string().email("Invalid email"),
  name: z.string().min(1, "Name is required"),
  username: z
    .string()
    // .min(3, "Username must be at least 3 characters")
    .toLowerCase(),
  password: z.string().min(5, "Password must be at least 5 characters"),

  // surname: z.string().nullable(),

  // age: z.number().nullable(),

  // imageUrl: z.string().nullable(),

  // description: z.string().nullable(),
});

type Inputs = z.infer<typeof FormDataSchema>;
type InputsSignup = z.infer<typeof FormDataSchemaSignup>;

export async function sendDataLogin(data: Inputs, url: string) {
  const cookiesStore = cookies();
  const result = await FormDataSchema.safeParseAsync(data);

  console.log(result.data);

  const response = await fetch(`${baseUrl}/${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(result.data),
  }).then((res) => res.json());

  const res = await fetch(`${baseUrl}/auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${response.token}`,
    },
  }).then((res) => res.json());

  cookiesStore.set("token", response.token);

  return { response, user: res.user };
}

export async function sendDataSignup(data: InputsSignup, url: string) {
  const cookiesStore = cookies();
  const result = await FormDataSchemaSignup.safeParseAsync(data);

  const response = await fetch(`${baseUrl}/${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(result.data),
  }).then((res) => res.json());

  const res = await fetch(`${baseUrl}/auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${response.token}`,
    },
  }).then((res) => res.json());

  cookiesStore.set("token", response.token);

  return { response, user: res.user };
}
