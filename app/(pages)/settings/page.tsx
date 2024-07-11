import PasswordForm from "@/app/(pages)/settings/PasswordForm";
import ProfileForm from "@/app/(pages)/settings/ProfileForm";

import React from "react";

const Page = () => {
  return (
    <main className="w-full space-y-4 px-1 md:px-5">
      <ProfileForm />

      <PasswordForm />
    </main>
  );
};

export default Page;
