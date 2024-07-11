"use client";

import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { getCommunities } from "./actions";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { deleteFriend } from "@/app/_actions";
import { MdPerson, MdSelfImprovement } from "react-icons/md";
import { ICommunity } from "@/interfaces/community";
import CommunityItem from "./CommunityItem";

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
  const [end, setEnd] = useState(!hasNextPage);
  const [ref, inView] = useInView({ rootMargin: "0px 0px 700px 0px" });
  const [renderCommunities, setRenderCommunities] = useState(communities);
  const [isCurrentUser, setIsCurrentUser] = useState<undefined | boolean>();

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
      <div
        className={`${
          end ? "block" : "hidden"
        } mb-32 w-full text-center text-2xl font-semibold`}
      >
        <MdSelfImprovement
          style={{ width: "8rem", height: "8rem" }}
          className="inline"
        />
        <p>Hmmmm... I think there are no more communities</p>
      </div>
    </div>
  );
};

export default InfiniteScrollCommunities;
