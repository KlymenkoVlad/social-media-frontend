import React from "react";
import FormCommunityCreate from "./FormCommunityCreate";
import FormCommunityEdit from "./FormCommunityEdit";

const page = () => {
  return (
    <main className="w-full space-y-4 px-1 md:px-5">
      <FormCommunityCreate />
      <FormCommunityEdit />
    </main>
  );
};

export default page;
