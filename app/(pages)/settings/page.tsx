import React from "react";
import PasswordForm from "./_components/PasswordForm";
import ProfileForm from "./_components/ProfileForm";

const Page = () => {
  return (
    <main className="w-full space-y-4 px-1 md:px-5">
      <ProfileForm />

      <PasswordForm />
    </main>
  );
};

export default Page;
