import Link from "next/link";
import React from "react";
import { MdWavingHand } from "react-icons/md";

const NotFound = () => {
  return (
    <section className="flex h-dvh w-dvw items-center justify-center text-center font-semibold">
      <div className="space-y-5">
        <MdWavingHand className="inline text-center text-9xl" />

        <h2 className="text-2xl font-bold">Not Found</h2>
        <div>
          <p>Could not find requested resource</p>
          <p>
            Probably the page you are looking for does not exist or I&apos;m
            working on it
          </p>
        </div>
        <Link
          className="block animate-pulse text-6xl text-red-500 transition-colors hover:text-red-600"
          href="/feed"
        >
          Return Home
        </Link>
      </div>
    </section>
  );
};

export default NotFound;
