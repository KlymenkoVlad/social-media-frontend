"use client";

import {
  addFriendRequest,
  revalidateFriendsRecommendations,
} from "@/app/_actions";
import BlankAvatar from "@/components/BlankAvatar";
import { PersonAdd } from "@mui/icons-material";
import Link from "next/link";
import toast from "react-hot-toast";

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
          <p className="text-xs">{username}</p>
        </div>
      </Link>

      <div className="flex h-8 w-10 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-gray-200">
        <PersonAdd
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
          className="text-gray-500"
        />
      </div>
    </li>
  );
};

export default Person;
