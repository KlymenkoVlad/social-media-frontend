"use client";

import React, { useState } from "react";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { IPost } from "@/interfaces/post";
import ImageUploadingPreview from "./ImageUploadingPreview";
import { baseUrl } from "@/utils/baseUrl";
import {
  ACCEPTED_IMAGE_MIME_TYPES,
  MAX_FILE_SIZE,
} from "@/constants/constants";
import { sendPost } from "@/actions/post";

const FormSchema = z.object({
  text: z.string().min(1, "Text is required").max(3000, "Text is too long"),
  title: z
    .string()
    .max(50, "Title is too long(above 50 characters)")
    .optional(),
  imageUrl: z
    .any()
    .refine((files) => {
      if (!files || files.length === 0) return true;
      return files[0].size <= MAX_FILE_SIZE;
    }, `Max image size is 5MB.`)
    .refine((files) => {
      if (!files || files.length === 0) return true;
      return ACCEPTED_IMAGE_MIME_TYPES.includes(files[0].type);
    }, "Only .jpg, .jpeg, .png and .webp formats are supported.")
    .optional()
    .nullable(),
});

const arePostsEqual = (
  prevProps: {
    setPosts: React.Dispatch<React.SetStateAction<IPost[]>>;
    posts: IPost[];
  },
  nextProps: {
    setPosts: React.Dispatch<React.SetStateAction<IPost[]>>;
    posts: IPost[];
  },
): boolean => {
  const { posts: postsA } = prevProps;
  const { posts: postsB } = nextProps;

  if (postsA.length !== postsB.length) return false;

  for (let i = 0; i < postsA.length; i++) {
    if (postsA[i].id !== postsB[i].id) return false;
  }

  return true;
};

const PostSubmitForm = ({
  setPosts,
  posts,
}: {
  setPosts: React.Dispatch<React.SetStateAction<IPost[]>>;
  posts: IPost[];
}) => {
  const [showTitleForm, setShowTitleForm] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  type Inputs = z.infer<typeof FormSchema>;

  const {
    register,
    reset,
    handleSubmit,
    watch,

    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(FormSchema),
  });

  const processForm: SubmitHandler<Inputs> = async (data) => {
    setIsSubmitting(true);
    toast.loading("Create your post...");

    let img: string | undefined;

    if (data.imageUrl.length > 0) {
      const formData = new FormData();
      formData.append("file", data.imageUrl[0]);
      const res = await fetch(`${baseUrl}/post/upload`, {
        method: "POST",
        body: formData,
      }).then((res) => res.json());

      img = res.url;
    }

    const result = await sendPost(data.text, data.title, img);

    toast.remove();
    if (result.error) {
      toast.error("Something went wrong");
    } else {
      setPosts([result.post, ...posts]);

      toast.success("Post created");
    }

    reset();
    setIsSubmitting(false);
  };

  const imageUrl = watch("imageUrl");

  return (
    <form className="mb-4" onSubmit={handleSubmit(processForm)}>
      <div className="w-full rounded-lg border border-gray-200 bg-gray-50">
        <div className="rounded-t-lg bg-white px-4 py-2">
          <label htmlFor="text" className="sr-only">
            What&apos;s new
          </label>
          <textarea
            id="text"
            rows={4}
            onFocus={() => setShowTitleForm(true)}
            className="max-h-[1000px] min-h-24 w-full border-0 bg-white px-0 text-sm text-gray-900 focus:outline-none focus:ring-0"
            placeholder="What's new"
            required
            {...register("text")}
          />
        </div>
        <div className="items-center justify-between border-t px-3 py-2">
          <input
            type="file"
            {...register("imageUrl")}
            disabled={isSubmitting}
            className="mb-3 w-full border-2 border-blue-300 text-sm text-black transition-colors file:m-1 file:mr-3 file:cursor-pointer file:border-2 file:border-blue-300 file:bg-stone-50 file:px-3 file:py-1 file:text-xs file:font-medium file:text-black file:transition-colors hover:cursor-pointer hover:border-blue-700 hover:file:border-blue-700 hover:file:bg-blue-50"
          />
          <button type="submit" disabled={isSubmitting} className="btn-blue">
            Post
          </button>
        </div>
      </div>
      <p className="text-red-500">{errors.text?.message}</p>
      <p className="text-red-500">{errors.imageUrl?.message?.toString()}</p>

      <div
        className={`mt-3 rounded-t-lg bg-white px-4 py-2 ${
          showTitleForm ? "block" : "hidden"
        }`}
      >
        <label htmlFor="title" className="sr-only">
          What&apos;s new
        </label>
        <input
          id="title"
          className="inline-flex w-full items-center rounded-md px-4 py-2.5 font-medium text-black focus:outline-none"
          placeholder="Title for your post"
          {...register("title")}
        />
      </div>
      <p className="mb-4 text-red-500">{errors.title?.message}</p>

      {imageUrl?.[0] && (
        <div className="rounded-md bg-white p-2 text-center font-semibold">
          <h3>Image preview:</h3>
          <ImageUploadingPreview file={imageUrl[0]} />
        </div>
      )}
    </form>
  );
};

export default React.memo(PostSubmitForm, arePostsEqual);
