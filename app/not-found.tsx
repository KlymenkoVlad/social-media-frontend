import Link from "next/link";
import React from "react";

const NotFound = () => {
  return (
    <div className="space-y-5 text-center font-bold">
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <p className="">
        Probably the page you are looking for does not exist or I&apos;m working
        on it
      </p>
      <Link className="mt-10 text-2xl text-red-500" href="/feed">
        Return Home
      </Link>
    </div>
  );
};

export default NotFound;
