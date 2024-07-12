"use client";

import React, { useEffect, useState } from "react";
import FormCommunityCreate from "./FormCommunityCreate";
import FormCommunityEdit from "./FormCommunityEdit";
import { isCommunityExist } from "@/actions/community";

const Page = () => {
  const [showForm, setShowForm] = useState<boolean>(false);

  useEffect(() => {
    const getCommunityStatus = async () => {
      const res = await isCommunityExist();
      setShowForm(!res);
    };

    getCommunityStatus();
  }, []);

  return showForm ? (
    <main className="w-full space-y-4 px-1 md:px-5">
      <FormCommunityEdit />
      <FormCommunityCreate />
    </main>
  ) : (
    <div className="w-full animate-pulse px-1 text-center text-3xl font-semibold md:px-5">
      Loading...
    </div>
  );
};

export default Page;
