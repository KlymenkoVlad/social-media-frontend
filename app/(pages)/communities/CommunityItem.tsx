import BlankAvatar from "@/components/BlankAvatar";
import { ICommunity } from "@/interfaces/community";
import { Colors } from "@/interfaces/user";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const CommunityItem = ({ community }: { community: ICommunity }) => {
  return (
    <Link
      href={`/communities/${community.id}`}
      className="mb-3 flex w-full items-center rounded-md border p-3 shadow-md transition-colors hover:bg-gray-200"
    >
      <div className="relative mr-3 flex h-24 min-h-24 w-24 min-w-24 items-start justify-center overflow-hidden rounded-full bg-gray-100">
        {community.imageUrl && (
          <Image
            width={100}
            height={100}
            src={community.imageUrl}
            className="h-full w-full"
            alt="Profile Photo"
          />
        )}
      </div>
      <div className="ml-3 space-y-2">
        <h2 className="text-xl font-semibold">
          {community.name[0].toUpperCase() + community.name.slice(1)}
        </h2>
        <p>{community.description}</p>
      </div>
    </Link>
  );
};

export default CommunityItem;
