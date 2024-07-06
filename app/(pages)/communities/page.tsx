import React from "react";
import { getCommunities } from "./actions";
import { ICommunity } from "@/interfaces/community";
import CommunityProfile from "./CommunityItem";
import InfiniteScrollCommunities from "./InfiniteScrollCommunities";

interface CommunitiesResponse {
  communities: ICommunity[];
  nextCursor: number;
  hasNextPage: boolean;
  communityLength: number;
}

const page = async () => {
  const communities: CommunitiesResponse = await getCommunities();

  return (
    <main className="w-full px-1 md:px-5">
      <InfiniteScrollCommunities {...communities} />
    </main>
  );
};
export default page;
