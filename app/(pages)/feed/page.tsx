import React from "react";
import {
  AddLink,
  AddPhotoAlternate,
  AttachFile,
  AddLocationAlt,
} from "@mui/icons-material";

import styles from "./feed.module.scss";
import Post from "@/components/common/Post";
import { getDataAuth } from "@/db/fetchData";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { baseUrl } from "@/utils/baseUrl";

export const metadata: Metadata = {
  title: "Feed",
  description:
    "Social media app that helps you connect and share with the people in your life.",
};
interface Post {
  id: number;
  title: string;
  text?: string;
  image_url?: string;
  user_id: number;
  created_at: Date;
  updated_at: Date;
  likes: [];
  comments: [];
  user: {
    username: string;
  };
}

export const getPosts = async (url: string) => {
  const cookiesStore = cookies();
  const token = cookiesStore.get("token")?.value;

  const res = await fetch(`${baseUrl}/${url}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    next: { tags: ["posts"] },
  });

  const data = await res.json();
  return data;
};

const feed = async () => {
  const { posts }: { posts: Post[] } = await getPosts("post");

  return (
    <div className="w-full mx-16 ">
      <form>
        <div className={styles.form_container}>
          <div className="px-4 py-2 bg-white rounded-t-lg ">
            <label htmlFor="comment" className="sr-only">
              What&apos;s new
            </label>
            <textarea
              id="comment"
              rows={4}
              className={styles.textarea_post}
              placeholder="What's new"
              required
            />
          </div>
          <div className="flex items-center justify-between px-3 py-2 border-t ">
            <button
              type="button"
              className="px-4 transition-colors text-center h-7 align-middle  text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-4 focus:ring-blue-300 font-semibold rounded-full text-sm"
            >
              Post
            </button>
            <div className="flex ">
              <button type="button" className={styles.btn_attach}>
                <AttachFile />
              </button>
              <button type="button" className={styles.btn_attach}>
                <AddLocationAlt />
              </button>
              <button type="button" className={styles.btn_attach}>
                <AddPhotoAlternate />
              </button>
              <button type="button" className={styles.btn_attach}>
                <AddLink />
              </button>
            </div>
          </div>
        </div>
      </form>
      {posts.length > 0 &&
        posts
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )
          .map((post) => (
            <Post
              key={post.id}
              postId={post.id}
              likes={post.likes}
              comments={post.comments}
              text={post.text}
              title={post.title}
              date={post.created_at}
              imageSrc={post.image_url}
              username={post.user.username}
            />
          ))}
    </div>
  );
};

export default feed;
