import PasswordForm from "@/components/pages/Settings/PasswordForm";
import ProfileForm from "@/components/pages/Settings/ProfileForm";

import React from "react";

const Page = () => {
  return (
    <section className="w-full space-y-4 px-8 py-4">
      <ProfileForm />

      <PasswordForm />
    </section>
  );
};

export default Page;
