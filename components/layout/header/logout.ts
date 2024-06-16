"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const logout = () => {
  "use server";

  cookies().delete("token");
  redirect("/signin");
};
