import Logo from "@/components/Logo";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import React from "react";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = cookies().get("token");

  if (token) {
    redirect("/feed");
  }

  return <div className="">{children}</div>;
}
