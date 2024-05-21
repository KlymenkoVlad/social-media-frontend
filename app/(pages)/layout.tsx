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

  if (!token) {
    redirect("/signin");
  }
  return (
    <div className="">
      <Header />
      <div className="flex justify-center mx-auto w-[1150px] mt-6">
        <LeftSidebar />
        {children}
        <RightSidebar />
      </div>
    </div>
  );
}