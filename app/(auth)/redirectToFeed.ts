"use server";

import { redirect } from "next/navigation";

export const redirectToFeed = () => {
  "use server";
  redirect("/feed");
};
