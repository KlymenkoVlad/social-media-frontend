import React from "react";
import { getFriendsRecommendations } from "@/app/_actions";
import Person from "./Person";

interface Recommendation {
  id: number;
  imageUrl: string | null;
  username: string;
  name: string;
}

const RightSidebar = async ({ inLeftSideBar }: { inLeftSideBar: boolean }) => {
  const recommendations: Recommendation[] = await getFriendsRecommendations();

  return (
    <aside
      className={` ${inLeftSideBar ? "block lg:hidden" : "hidden bg-white p-2 shadow-md lg:block"} h-fit min-w-56 rounded-md`}
    >
      <h2 className="mb-6 text-center text-xl font-semibold">
        People you may know
      </h2>
      <ul className="mb-6 space-y-5">
        {!recommendations ? (
          <p>Loading...</p>
        ) : recommendations?.length > 0 ? (
          recommendations
            ?.slice(0, 6)
            ?.map(({ username, name, imageUrl, id }) => (
              <Person
                username={username}
                name={name}
                imageSrc={imageUrl}
                friendId={id}
                key={id}
              />
            ))
        ) : (
          <p>No recommendations</p>
        )}
      </ul>
    </aside>
  );
};

export default RightSidebar;
