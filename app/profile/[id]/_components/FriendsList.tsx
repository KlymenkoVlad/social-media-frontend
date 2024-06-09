import React from "react";
import Link from "next/link";
import { getFriendsList } from "../actions";
import Person from "./Person";

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

const FriendsList = async ({ id }: { id: string }) => {
  const friends: Friend[] = await getFriendsList(id);

  return (
    <div className="block h-full min-w-60 rounded-md bg-white p-5 shadow-md">
      <h2 className="mb-6 text-center text-xl font-semibold">Friends List</h2>
      <ul className="mb-8 space-y-4">
        {friends ? (
          friends?.length > 0 ? (
            friends
              ?.slice(0, 6)
              ?.map((friend) => (
                <Person
                  username={friend.friend.username}
                  name={friend.friend.name}
                  imageSrc={friend.friend.image_url}
                  friendId={friend.friendId}
                  key={friend.id}
                />
              ))
          ) : (
            <p>No friends</p>
          )
        ) : (
          <p>loading...</p>
        )}
      </ul>
      {friends?.length > 6 && (
        <Link
          type="button"
          href={`/profile/friends/${id}`}
          className="grid h-7 w-full items-center rounded-full bg-blue-100 text-center text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          Show all
        </Link>
      )}
    </div>
  );
};

export default FriendsList;
