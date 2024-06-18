import Header from "@/components/layout/header/Header";
import LeftSidebar from "@/components/layout/leftsidebar/LeftSidebar";
import RightSidebar from "@/components/layout/rightsidebar/RightSidebar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = cookies().get("token");

  if (!token?.value || token.value.length <= 0) {
    redirect("/signin");
  }

  return (
    <div className="">
      <Header />
      <div className="mx-auto mt-6 flex max-w-[1150px] justify-center p-2">
        <LeftSidebar />
        {children}
        <RightSidebar inLeftSideBar={false} />
      </div>
    </div>
  );
}
