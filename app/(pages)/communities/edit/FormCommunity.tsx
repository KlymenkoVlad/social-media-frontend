"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { baseUrl } from "@/utils/baseUrl";
import ImageUploadingPreview from "@/components/ImageUploadingPreview";
import { MdBadge } from "react-icons/md";
import { createCommunity } from "../actions";

const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const FormDataSchema = z.object({
  name: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string().min(1, "Name is required").optional(),
  ),

  image_url: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z
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
  ),

  description: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string().max(50, "Description must be below 50 characters").optional(),
  ),
});

export type FormCommunityInputs = z.infer<typeof FormDataSchema>;

const FormCommunity = () => {
  const router = useRouter();

  const InputComponent = ({
    type,
    placeholder,
    name,
    logo,
  }: {
    type: string;
    placeholder: string;
    name: keyof FormCommunityInputs;
    logo: React.ReactNode;
  }) => {
    return (
      <div className="relative">
        <input
          type={type}
          autoComplete="on"
          className="mb-1 h-12 w-full rounded-md bg-gray-300 ps-14 focus:outline-none"
          placeholder={placeholder}
          {...register(name)}
        />
        {logo}
        {errors[name] && (
          <p className="absolute left-0 top-full text-sm text-red-400">
            {errors[name]?.message?.toString()}
          </p>
        )}
      </div>
    );
  };

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    watch,
  } = useForm<FormCommunityInputs>({
    resolver: zodResolver(FormDataSchema),
  });

  const processForm = async (data: FormCommunityInputs) => {
    toast.loading("Updating your profile...");
    if (data.image_url && data.image_url.length > 0) {
      const formData = new FormData();
      formData.append("file", data.image_url[0]);
      const res: { url: string } = await fetch(`${baseUrl}/post/upload`, {
        method: "POST",
        body: formData,
      }).then((res) => res.json());

      data.image_url = res.url;
    } else {
      delete data.image_url;
    }

    const res = await createCommunity(data);

    toast.remove();

    if (res) {
      toast.success("community created successfully");
    }

    reset();
  };

  const imageUrl = watch("image_url");

  return (
    <form onSubmit={handleSubmit(processForm)} className="space-y-5">
      <h1 className="col-span-2 mb-5 text-center text-3xl font-bold">
        Create your community
      </h1>

      <InputComponent
        type="text"
        name="name"
        logo={<MdBadge className="absolute left-3 top-3 h-6 w-6" />}
        placeholder={"Your community name"}
      />

      <textarea
        className="col-span-2 h-24 w-full rounded-md bg-gray-300 p-2 focus:outline-none"
        placeholder={"Tell us about your community"}
        {...register("description")}
      />
      {errors?.description && (
        <div>
          <p className="col-span-2 block text-sm text-red-400">
            {errors.description?.message}
          </p>
        </div>
      )}

      <div className="col-span-2 w-full items-center justify-between px-3 py-2">
        <input
          type="file"
          {...register("image_url")}
          className="mb-3 w-full border-2 border-blue-300 text-sm text-black transition-colors file:m-1 file:mr-3 file:cursor-pointer file:border-2 file:border-blue-300 file:bg-stone-50 file:px-3 file:py-1 file:text-xs file:font-medium file:text-black file:transition-colors hover:cursor-pointer hover:border-blue-700 hover:file:border-blue-700 hover:file:bg-blue-50"
        />
        <p className="text-red-500">{errors.image_url?.message?.toString()}</p>
      </div>

      {imageUrl?.[0] && (
        <div className="col-span-2 rounded-md bg-white p-2 text-center font-semibold">
          <h3>Image preview:</h3>
          <ImageUploadingPreview file={imageUrl[0]} />
        </div>
      )}

      <button
        className="col-span-2 mb-12 mt-3 h-12 w-full rounded-md bg-indigo-600 text-white"
        type="submit"
      >
        Save
      </button>
    </form>
  );
};

export default FormCommunity;
