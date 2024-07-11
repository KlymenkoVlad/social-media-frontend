"use client";

import { ICommunity } from "@/interfaces/community";
import React, { useEffect, useState } from "react";
import CommunityProfile from "./CommunityProfile";
import InfiniteScrollPosts from "./InfiniteScrollPosts";
import { IPost } from "@/interfaces/post";
import { useForm } from "react-hook-form";
import PostSubmitForm from "./PostSubmitForm";

interface CommunityPosts {
  status: string;
  posts: IPost[];
  nextCursor: null | number;
  hasNextPage: boolean;
  postsLength: number;
}

const Community = ({
  community,
  communityRequest,
  communityId,
}: {
  community: ICommunity;
  communityRequest: CommunityPosts;
  communityId: number;
}) => {
  const [renderPosts, setRenderPosts] = useState(communityRequest.posts);
  const [userId, setUserId] = useState<string | null>();

  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
  }, []);

  const { register, watch } = useForm();

  const sortBy = watch("sortBy") || "new";
  return (
    <main className="w-full space-y-4 px-1 md:px-5">
      <CommunityProfile community={community} />

      {userId && +userId === community.userId && (
        <section className="w-full overflow-hidden rounded-md">
          <PostSubmitForm
            setPosts={setRenderPosts}
            posts={renderPosts}
            communityId={communityId}
          />
        </section>
      )}
      <section className="min-h-[329px] w-full overflow-hidden rounded-md">
        <div className="mb-4 flex items-center justify-around bg-white p-4">
          <h1 className="text-lg font-bold">You can sort by:</h1>
          <select
            className="block rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            id="sort"
            defaultValue="new"
            {...register("sortBy")}
          >
            <option value="new">New</option>
            <option value="old">Old</option>
          </select>
        </div>

        {/* Posts */}

        <ul role="list">
          {community && (
            <InfiniteScrollPosts
              posts={renderPosts}
              setRenderPosts={setRenderPosts}
              hasNextPage={communityRequest.hasNextPage}
              nextCursor={communityRequest.nextCursor}
              postsLength={communityRequest.postsLength}
              sortBy={sortBy}
              communityId={communityId}
            />
          )}
        </ul>
      </section>
    </main>
  );
};

export default Community;
