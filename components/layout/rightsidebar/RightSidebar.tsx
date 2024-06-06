"use client";

import BlankAvatar from "@/components/BlankAvatar";
import { PersonAdd } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getFriendsList } from "@/app/_actions";

const Person = ({
  username,
  imageSrc,
  name,
}: {
  username: string;
  imageSrc: string | null;
  name: string;
}) => {
  return (
    <li className="flex items-center">
      <div className="flex w-full items-center">
        <BlankAvatar imageSrc={imageSrc} />
        <div className="ml-3">
          <p className="">{name}</p>
          <p className="text-xs">{username}</p>
        </div>
      </div>

      <div className="flex h-8 w-10 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-gray-200">
        <PersonAdd className="text-gray-500" />
      </div>
    </li>
  );
};

interface Friend {
  friend: {
    id: number;
    image_url: string | null;
    name: string;
    username: string;
  };
  friendId: number;
  id: number;
  userId: number;
}

const RightSidebar = () => {
  const pathname = usePathname();
  const [friends, setFriends] = useState<Friend[]>();
  const [loading, setLoading] = useState(true);

  const showFriendsList = pathname.search("/profile") !== -1;

  useEffect(() => {
    const userId = pathname.split("/")[2];
    if (!userId) return;
    const fetchData = async () => {
      const res: Friend[] = await getFriendsList(userId);
      setFriends(res);
      setLoading(false);
    };

    fetchData();
  }, [showFriendsList]);

  return (
    <div className="block h-full min-w-60 rounded-md bg-white p-5 shadow-md">
      <h2 className="mb-6 text-center text-xl font-semibold">
        {showFriendsList ? "Friends List" : "People you may know"}
      </h2>
      <div className="mb-6 space-y-8">
        {!loading ? (
          friends && showFriendsList ? (
            <div>
              <ul className="space-y-4">
                {friends?.length > 0 &&
                  friends
                    ?.slice(0, 6)
                    ?.map((friend) => (
                      <Person
                        username={friend.friend.username}
                        name={friend.friend.name}
                        imageSrc={friend.friend.image_url}
                        key={friend.id}
                      />
                    ))}
              </ul>

              {friends?.length > 0 && friends?.length <= 6 && (
                <h3 className="mt-6 text-center">That&apos;s all</h3>
              )}

              {friends?.length > 6 && (
                <button
                  type="button"
                  className="h-7 w-full rounded-full bg-blue-100 text-center align-middle text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
                >
                  Show all
                </button>
              )}

              {friends?.length === 0 && <p>No friends</p>}
            </div>
          ) : (
            // <Person />
            <div>dfjasd</div>
          )
        ) : (
          <p>Loading...</p>
        )}
      </div>
      {/* <button
        type="button"
        className="h-7 w-full rounded-full bg-blue-100 text-center align-middle text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
      >
        Show all
      </button> */}
    </div>
  );
};

export default RightSidebar;
