import React from "react";
import { getFriendsRecommendations } from "@/app/_actions";
import Person from "./Person";

interface Recommendation {
  id: number;
  image_url: string | null;
  username: string;
  name: string;
}

const RightSidebar = async () => {
  const recommendations: Recommendation[] = await getFriendsRecommendations();

  return (
    <div className="block h-full min-w-60 rounded-md bg-white p-5 shadow-md">
      <h2 className="mb-6 text-center text-xl font-semibold">
        People you may know
      </h2>
      <ul className="mb-6 space-y-5">
        {!recommendations ? (
          <p>Loading...</p>
        ) : recommendations?.length > 0 ? (
          recommendations
            ?.slice(0, 6)
            ?.map(({ username, name, image_url, id }) => (
              <Person
                username={username}
                name={name}
                imageSrc={image_url}
                friendId={id}
                key={id}
              />
            ))
        ) : (
          <p>No recommendations</p>
        )}
      </ul>
    </div>
  );
};

export default RightSidebar;
