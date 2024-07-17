import React from "react";
import Community from "./_components/Community";
import { ICommunity } from "@/interfaces/community";
import { IPost } from "@/interfaces/post";
import { getCommunity, getCommunityPosts } from "@/actions/community";

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
