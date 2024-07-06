import React from "react";
import { getCommunity, getCommunityPosts } from "../actions";
import Community from "./Community";
import { ICommunity } from "@/interfaces/community";
import { IPost } from "@/interfaces/post";

interface CommunityPosts {
  status: string;
  posts: IPost[];
  nextCursor: null | number;
  hasNextPage: boolean;
  postsLength: number;
}

const page = async (params: { params: { communityId: string } }) => {
  const community: ICommunity = await getCommunity(+params.params.communityId);
  const communityPosts: CommunityPosts = await getCommunityPosts(
    +params.params.communityId,
  );

  return (
    <Community
      community={community}
      communityRequest={communityPosts}
      communityId={+params.params.communityId}
    />
  );
};

export default page;
