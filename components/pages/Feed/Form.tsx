"use client";

import {
  AddLink,
  AddLocationAlt,
  AddPhotoAlternate,
  AttachFile,
} from "@mui/icons-material";
import React from "react";
import styles from "./feed.module.scss";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendPost } from "@/app/_actions";
import toast from "react-hot-toast";
import { revalidateTag } from "next/cache";

//TODO capability to add image

const Form = () => {
  const FormSchema = z.object({
    text: z.string().min(1, "Title is required"),
    imageUrl: z.string().optional(),
  });

  type Inputs = z.infer<typeof FormSchema>;

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(FormSchema),
  });

  const processForm: SubmitHandler<Inputs> = async (data) => {
    const result = await sendPost(data);

    if (result.error) {
      toast.error("Something went wrong");
    } else {
      toast.success("Post created");
    }

    reset();
  };

  return (
    <form className="mb-4" onSubmit={handleSubmit(processForm)}>
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
      <p className="text-red-500">{errors.text?.message}</p>
    </form>
  );
};

export default Form;
