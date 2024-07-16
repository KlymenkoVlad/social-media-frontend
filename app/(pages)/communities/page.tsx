import React from "react";
import { ICommunity } from "@/interfaces/community";
import InfiniteScrollCommunities from "./_components/InfiniteScrollCommunities";
import { getCommunities } from "@/actions/community";

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
