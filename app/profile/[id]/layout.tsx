import Header from "@/components/layout/header/Header";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import FriendsList from "./_components/FriendsList";
import LeftSidebarProfile from "./_components/LeftSidebarProfile";

export default function PageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const token = cookies().get("token");

  if (!token?.value || token.value.length <= 0) {
    redirect("/signin");
  }

  return (
    <div className="">
      <Header />
      <div className="mx-auto mt-6 flex max-w-[1150px] justify-center p-2">
        <LeftSidebarProfile id={params.id} />
        {children}
        <FriendsList id={params.id} />
      </div>
    </div>
  );
}
