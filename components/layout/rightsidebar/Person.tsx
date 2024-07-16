"use client";

import {
  addFriendRequest,
  revalidateFriendsRecommendations,
} from "@/actions/friend";
import BlankAvatar from "@/components/ui/BlankAvatar";
import { stringCut } from "@/utils/stringCut";
import Link from "next/link";
import toast from "react-hot-toast";
import { MdPersonAdd } from "react-icons/md";

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
          <p className="">{stringCut(name, 9)}</p>
          <p className="text-xs">{stringCut(username, 14)}</p>
        </div>
      </Link>

      <div className="flex h-8 w-10 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-gray-200">
        <MdPersonAdd
          onClick={async () => {
            toast.loading("Adding friend...");
            const res = await addFriendRequest(friendId);
            toast.remove();
            if (!res.error) {
              toast.success("Friend request sent");
              revalidateFriendsRecommendations();
              return;
            }
            toast.error(res.message);
          }}
          className="inline-block text-2xl text-gray-500"
        />
      </div>
    </li>
  );
};

export default Person;
