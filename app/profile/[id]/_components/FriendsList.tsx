import React from "react";
import Link from "next/link";
import { getFriendsList } from "../actions";
import Person from "./Person";
import { IFriend } from "@/interfaces/friend";

const FriendsList = async ({ id }: { id: string }) => {
  const friends: IFriend[] = await getFriendsList(id);

  return (
    <div
      className={`hidden h-fit min-w-60 rounded-md bg-white p-5 shadow-md lg:block`}
    >
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
                  imageSrc={friend.friend.imageUrl}
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
          href={`/friends/${id}`}
          className="grid h-7 w-full items-center rounded-full bg-blue-100 text-center text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          Show all
        </Link>
      )}
    </div>
  );
};

export default FriendsList;
