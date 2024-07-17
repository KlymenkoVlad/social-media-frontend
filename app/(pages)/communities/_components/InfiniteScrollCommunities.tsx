"use client";

import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { ICommunity } from "@/interfaces/community";
import CommunityItem from "./CommunityItem";
import { getCommunities } from "@/actions/community";
import InfiniteScrollEndIcon from "@/components/ui/InfiniteScrollEndIcon";

interface CommunityResponse {
  communities: ICommunity[];
  nextCursor: number;
  hasNextPage: boolean;
  communityLength: number;
}

const InfiniteScrollCommunities = ({
  communities,
  nextCursor,
  hasNextPage,
}: CommunityResponse) => {
  const [cursor, setCursor] = useState<number | null>(nextCursor);
  const [end, setEnd] = useState<boolean>(!hasNextPage);
  const [ref, inView] = useInView({ rootMargin: "0px 0px 700px 0px" });
  const [renderCommunities, setRenderCommunities] = useState(communities);

  const fetchPosts = async () => {
    if (end) {
      return;
    }

    const data: CommunityResponse = await getCommunities(cursor);

    if (!data.hasNextPage || !hasNextPage) {
      setEnd(true);
    }

    setRenderCommunities([...renderCommunities, ...data.communities]);

    setCursor(data.nextCursor);
  };

  useEffect(() => {
    if (inView && !end) {
      fetchPosts();
    }
  }, [inView]);

  return (
    <div>
      {renderCommunities &&
        renderCommunities?.length > 0 &&
        renderCommunities.map((community) => (
          <CommunityItem key={community.id} community={community} />
        ))}

      <div ref={ref} className={`${end ? "hidden" : "block"}`}>
        Loading...
      </div>

      <InfiniteScrollEndIcon end={end} text="communities" />
    </div>
  );
};

export default InfiniteScrollCommunities;
