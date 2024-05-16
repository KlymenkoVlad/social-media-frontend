import React from "react";
import {
  AddLink,
  AddPhotoAlternate,
  AttachFile,
  AddLocationAlt,
  MoreHoriz,
  Favorite,
  Reply,
} from "@mui/icons-material";

import styles from "./feed.module.scss";
import BlankAvatar from "@/components/common/BlankAvatar";
import Image from "next/image";
import Post from "@/components/common/Post";

const feed = () => {
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
            ></textarea>
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

      <Post
        name="Sergey"
        date="5 min ago"
        imageSrc="/free-images.avif"
        likesCount={10}
        commentsCount={2}
        sharedCount={5}
      />
    </div>
  );
};

export default feed;
