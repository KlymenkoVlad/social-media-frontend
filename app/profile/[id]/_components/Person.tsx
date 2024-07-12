"use client";

import BlankAvatar from "@/components/BlankAvatar";
import toast from "react-hot-toast";
import Link from "next/link";
import { MdPersonRemove } from "react-icons/md";
import { deleteFriend, revalidateFriendsList } from "@/actions/friend";

const Person = ({
  username,
  imageSrc,
  name,
  friendId,
}: {
  username: string;
  imageSrc: string | null;
  name: string;
  friendId: number;
}) => {
  return (
    <li className="flex items-center">
      <Link
        href={`/profile/${friendId}`}
        className="flex w-full items-center rounded-md p-2 transition-colors hover:bg-gray-100"
      >
        <BlankAvatar imageSrc={imageSrc} />
        <div className="ml-3">
          <p className="">{name}</p>
          <p className="text-xs">@{username}</p>
        </div>
      </Link>

      <div className="flex h-8 w-10 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-gray-200">
        <MdPersonRemove
          onClick={async () => {
            toast.loading("Deleting friend...");
            const status = await deleteFriend(friendId);
            toast.remove();
            if (status === 200) {
              toast.success("Friend deleted");
              await revalidateFriendsList();
              return;
            }

            toast.error("Something went wrong");
          }}
          className="inline-block text-2xl text-gray-500"
        />
      </div>
    </li>
  );
};

export default Person;
