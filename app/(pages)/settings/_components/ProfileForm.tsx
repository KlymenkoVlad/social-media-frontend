"use client";

import { User } from "@/interfaces/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { baseUrl } from "@/utils/baseUrl";
import ImageUploadingPreview from "@/components/ImageUploadingPreview";
import { MdBadge, MdCake, MdContactEmergency, MdEmail } from "react-icons/md";
import {
  ACCEPTED_IMAGE_MIME_TYPES,
  MAX_FILE_SIZE,
} from "@/constants/constants";
import { getUser, updateUserProfile } from "@/actions/user";

const FormDataSchema = z.object({
  email: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string().email("Invalid email").optional(),
  ),

  name: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string().min(1, "Name is required").optional(),
  ),

  username: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string().min(3, "Username must be at least 3 characters").optional(),
  ),

  surname: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string().optional(),
  ),

  age: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z
      .string()
      .refine(
        (value) => typeof +value === "number" && +value >= 18,
        "You must be at least 18 years old",
      )
      .optional(),
  ),

  imageUrl: z.preprocess(
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
    z.string().max(40, "Description must be below 40 characters").optional(),
  ),
});

export type ProfileFormInputs = z.infer<typeof FormDataSchema>;

const ProfileForm = () => {
  const [user, setUser] = useState<User>();

  const router = useRouter();

  useEffect(() => {
    const userFetching = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;
      const { user } = await getUser(+userId);

      setUser(user);
    };

    userFetching();
  }, []);

  const InputComponent = ({
    type,
    placeholder,
    name,
    logo,
  }: {
    type: string;
    placeholder: string;
    name: keyof ProfileFormInputs;
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
  } = useForm<ProfileFormInputs>({
    resolver: zodResolver(FormDataSchema),
  });

  const processForm = async (data: ProfileFormInputs) => {
    toast.loading("Updating your profile...");
    if (data.imageUrl && data.imageUrl.length > 0) {
      const formData = new FormData();
      formData.append("file", data.imageUrl[0]);
      const res = await fetch(`${baseUrl}/post/upload`, {
        method: "POST",
        body: formData,
      }).then((res) => res.json());

      data.imageUrl = res.url;
    } else {
      delete data.imageUrl;
    }

    const res = await updateUserProfile(data);

    toast.remove();

    if (res.statusCode === 304) {
      toast.error("No changes were made");
    } else if (res.statusCode === 200) {
      toast.success("Profile updated successfully");
      router.refresh();
    } else if (res.statusCode === 409) {
      toast.error(res.message);
    } else {
      toast.error("Something went wrong");
    }

    reset();
  };

  const imageUrl = watch("imageUrl");

  return (
    <form
      onSubmit={handleSubmit(processForm)}
      className="grid grid-cols-2 items-center gap-2 md:gap-6"
    >
      <h1 className="col-span-2 mb-5 text-center text-3xl font-bold">
        Change Your Profile Settings
      </h1>

      <InputComponent
        type="email"
        name="email"
        logo={<MdEmail className="absolute left-3 top-3 h-6 w-6" />}
        placeholder={user?.email || "Your email(not defined)"}
      />
      <InputComponent
        type="number"
        name="age"
        logo={<MdCake className="absolute left-3 top-3 h-6 w-6" />}
        placeholder={user?.age?.toString() || "Your age(not defined)"}
      />
      <InputComponent
        type="text"
        name="name"
        logo={<MdBadge className="absolute left-3 top-3 h-6 w-6" />}
        placeholder={user?.name || "Your first name(not defined)"}
      />
      <InputComponent
        type="text"
        name="surname"
        logo={<MdBadge className="absolute left-3 top-3 h-6 w-6" />}
        placeholder={user?.surname || "Your last name(not defined)"}
      />
      <div className="col-span-2">
        <InputComponent
          type="text"
          name="username"
          logo={
            <MdContactEmergency className="absolute left-3 top-3 h-6 w-6" />
          }
          placeholder={user?.username || "Your username(not defined)"}
        />
      </div>

      <textarea
        className="col-span-2 h-24 w-full rounded-md bg-gray-300 p-2 focus:outline-none"
        placeholder={user?.description || "Tell us about yourself"}
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
          {...register("imageUrl")}
          className="mb-3 w-full border-2 border-blue-300 text-sm text-black transition-colors file:m-1 file:mr-3 file:cursor-pointer file:border-2 file:border-blue-300 file:bg-stone-50 file:px-3 file:py-1 file:text-xs file:font-medium file:text-black file:transition-colors hover:cursor-pointer hover:border-blue-700 hover:file:border-blue-700 hover:file:bg-blue-50"
        />
        <p className="text-red-500">{errors.imageUrl?.message?.toString()}</p>
      </div>

      {imageUrl?.[0] && (
        <div className="col-span-2 rounded-md bg-white p-2 text-center font-semibold">
          <h3>Image preview:</h3>
          <ImageUploadingPreview file={imageUrl[0]} />
        </div>
      )}

      <button className="btn-blue col-span-2" type="submit">
        Save
      </button>
    </form>
  );
};

export default ProfileForm;
