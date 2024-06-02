"use client";

import { getUser, updateUserProfile } from "@/app/_actions";
import { User } from "@/interfaces/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge, Cake, ContactEmergency, Email } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import ImagePreview from "../Feed/ImagePreview";
import { baseUrl } from "@/utils/baseUrl";

const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

//TODO: Image updating, validate case when data are the same as before
const FormDataSchema = z.object({
  email: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string().email("Invalid email").optional()
  ),

  name: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string().min(1, "Name is required").optional()
  ),

  username: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string().min(3, "Username must be at least 3 characters").optional()
  ),

  surname: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string().optional()
  ),

  age: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string().optional()
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
      .nullable()
  ),

  description: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string().max(40, "Description must be below 40 characters").optional()
  ),
});

export type ProfileFormInputs = z.infer<typeof FormDataSchema>;

const ProfileForm = () => {
  const [user, setUser] = useState<User>();

  const router = useRouter();

  useEffect(() => {
    const userFetching = async () => {
      const userId = localStorage.getItem("userId");
      const user = await getUser(+userId);

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
      <div className="relative ">
        <input
          type={type}
          className="w-full bg-gray-300 h-12 rounded-md ps-14 focus:outline-none mb-1"
          placeholder={placeholder}
          {...register(name)}
        />
        {logo}
        {errors[name] && (
          <p className="text-sm text-red-400 absolute top-full left-0">
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
    if (data.image_url && data.image_url.length > 0) {
      const formData = new FormData();
      formData.append("file", data.image_url[0]);
      const res = await fetch(`${baseUrl}/post/upload`, {
        method: "POST",
        body: formData,
      }).then((res) => res.json());

      data.image_url = res.url;
    } else {
      delete data.image_url;
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

  const imageUrl = watch("image_url");

  return (
    <form
      onSubmit={handleSubmit(processForm)}
      className="grid grid-cols-2 items-center gap-6"
    >
      <h1 className="text-3xl font-bold text-center mb-5 col-span-2">
        Change Your Profile Settings
      </h1>

      <InputComponent
        type="email"
        name="email"
        logo={<Email className="absolute top-3 left-3" />}
        placeholder={user?.email || "Your email(not defined)"}
      />
      <InputComponent
        type="text"
        name="age"
        logo={<Cake className="absolute top-3 left-3" />}
        placeholder={user?.age?.toString() || "Your age(not defined)"}
      />
      <InputComponent
        type="text"
        name="name"
        logo={<Badge className="absolute top-3 left-3" />}
        placeholder={user?.name || "Your first name(not defined)"}
      />
      <InputComponent
        type="text"
        name="surname"
        logo={<Badge className="absolute top-3 left-3" />}
        placeholder={user?.surname || "Your last name(not defined)"}
      />
      <div className="col-span-2">
        <InputComponent
          type="text"
          name="username"
          logo={<ContactEmergency className="absolute top-3 left-3" />}
          placeholder={user?.username || "Your username(not defined)"}
        />
      </div>

      <textarea
        className="w-full bg-gray-300 h-24 rounded-md p-2 focus:outline-none col-span-2 "
        name="description"
        placeholder={user?.description || "Tell us about yourself"}
        {...register("description")}
      />
      {errors?.description && (
        <div>
          <p className="text-sm text-red-400  col-span-2 block">
            {errors.description?.message}
          </p>
        </div>
      )}

      <div className=" items-center justify-between px-3 py-2 col-span-2 w-full ">
        <input
          type="file"
          {...register("image_url")}
          className="w-full block text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none "
        />
        <p className="text-red-500">{errors.image_url?.message?.toString()}</p>
      </div>

      {imageUrl?.[0] && (
        <div className="text-center font-semibold bg-white rounded-md p-2 col-span-2">
          <h3>Image preview:</h3>
          <ImagePreview file={imageUrl[0]} />
        </div>
      )}

      <button
        className="w-full bg-indigo-600 h-12 rounded-md mt-3 text-white mb-12 col-span-2"
        type="submit"
      >
        Save
      </button>
    </form>
  );
};

export default ProfileForm;
