import PasswordForm from "@/app/(pages)/settings/PasswordForm";
import ProfileForm from "@/app/(pages)/settings/ProfileForm";

import React from "react";

const Page = () => {
  return (
    <section className="w-full space-y-4 px-5 py-4">
      <ProfileForm />

      <PasswordForm />
    </section>
  );
};

export default Page;
