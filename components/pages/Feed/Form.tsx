"use client";

import React, { useState } from "react";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendPost } from "@/app/_actions";
import toast from "react-hot-toast";
import { IPost } from "@/interfaces/post";
import ImagePreview from "./ImagePreview";
import { baseUrl } from "@/utils/baseUrl";

//TODO capability to add image
//TODO delete any from type

const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const Form = ({ setPosts, posts }: { setPosts: any; posts: IPost[] }) => {
  const [showTitleForm, setShowTitleForm] = useState<boolean>(false);

  const FormSchema = z.object({
    text: z.string().min(1, "Text is required"),
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
    toast.loading("Create your post...");

    let img: string;
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
  };

  const imageUrl = watch("imageUrl");

  return (
    <form className="mb-4" onSubmit={handleSubmit(processForm)}>
      <div className="w-full  border border-gray-200 rounded-lg bg-gray-50">
        <div className="px-4 py-2 bg-white rounded-t-lg ">
          <label htmlFor="comment" className="sr-only">
            What&apos;s new
          </label>
          <textarea
            id="comment"
            rows={4}
            onFocus={() => setShowTitleForm(true)}
            className="focus:outline-none w-full px-0 text-sm text-gray-900 bg-white border-0 focus:ring-0"
            placeholder="What's new"
            required
            {...register("text")}
          />
        </div>
        <div className="flex items-center justify-between px-3 py-2 border-t ">
          <button
            type="submit"
            className="px-4 transition-colors text-center h-7 align-middle  text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-4 focus:ring-blue-300 font-semibold rounded-full text-sm"
          >
            Post
          </button>
          <input
            type="file"
            {...register("imageUrl")}
            className="block text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none "
          />
        </div>
      </div>
      <p className="text-red-500">{errors.text?.message}</p>
      <p className="text-red-500">{errors.imageUrl?.message?.toString()}</p>

      <div
        className={`px-4 py-2 bg-white rounded-t-lg mt-3 ${
          showTitleForm ? "block" : "hidden"
        }`}
      >
        <label htmlFor="comment" className="sr-only">
          What&apos;s new
        </label>
        <input
          id="comment"
          className=" w-full inline-flex items-center py-2.5 px-4 font-medium text-black rounded-md  focus:outline-none "
          placeholder="Title for your post"
          {...register("title")}
        />
      </div>
      <p className="text-red-500 mb-4">{errors.title?.message}</p>

      {imageUrl?.[0] && (
        <div className="text-center font-semibold bg-white rounded-md p-2">
          <h3>Image preview:</h3>
          <ImagePreview file={imageUrl[0]} />
        </div>
      )}
    </form>
  );
};

export default Form;
