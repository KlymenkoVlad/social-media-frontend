"use client";

//* TODO
//* Add image upload

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { redirectToFeed } from "../redirectToFeed";
import { MdBadge, MdContactEmergency, MdEmail, MdLock } from "react-icons/md";
import { signup } from "@/actions/auth";

const FormDataSchemaSignup = z.object({
  email: z.string().email("Invalid email"),
  name: z
    .string()
    .min(1, "Name is required")
    .max(30, "Look's like you have a very long name"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(15, "Username must be at most 15 characters")
    .toLowerCase(),
  password: z.string().min(5, "Password must be at least 5 characters"),

  // surname: z.string().nullable(),

  // age: z.number().nullable(),

  // imageUrl: z.string().nullable(),

  // description: z.string().nullable(),
});

export type SignupInputs = z.infer<typeof FormDataSchemaSignup>;

const Page = () => {
  const InputComponent = ({
    type,
    placeholder,
    name,
    logo,
  }: {
    type: string;
    placeholder: string;
    name: keyof SignupInputs;
    logo: React.ReactNode;
  }) => {
    return (
      <div className="relative">
        <input
          type={type}
          className="mb-1 h-12 w-full rounded-md bg-gray-300 ps-14 focus:outline-none"
          placeholder={placeholder}
          {...register(name)}
        />
        {logo}
        {errors[name] && (
          <p className="absolute left-0 top-full text-sm text-red-400">
            {errors[name]?.message}
          </p>
        )}
      </div>
    );
  };

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInputs>({
    resolver: zodResolver(FormDataSchemaSignup),
  });

  const processForm: SubmitHandler<SignupInputs> = async (data) => {
    toast.loading("Creating your account...");
    const { res, user } = await signup(data);

    toast.remove();
    if (res.error) {
      if (res.statusCode === 409) {
        toast.error("User already exists");
        return;
      }

      if (res.statusCode === 400 && res.message[0]) {
        toast.error(res.message[0]);
        return;
      }

      toast.error("Something went wrong");
      return;
    }

    if (user) {
      localStorage.setItem("userId", user.id.toString());
      localStorage.setItem("username", user.username);
    }

    toast.success("Your account has been created");
    redirectToFeed();
    reset();
  };

  return (
    <section className="h-dvh w-dvw p-0 sm:p-8">
      <form onSubmit={handleSubmit(processForm)} className="flex h-full w-full">
        <div className="hidden w-2/5 p-10 md:block">
          <Image
            src={"/signin_illustration.svg"}
            className="h-full min-w-full max-w-full rounded-sm"
            width={80}
            height={80}
            quality={100}
            alt="image"
          />
        </div>

        <div className="w-full place-content-center rounded-md bg-white p-4 md:w-3/5">
          <h1 className="mb-8 text-center text-3xl font-semibold">
            Welcome to{" "}
            <span className="font-extrabold text-indigo-600">Newmedia</span>
          </h1>
          <h2 className="mb-5 text-xl font-semibold"></h2>

          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
            <InputComponent
              type="email"
              name="email"
              logo={<MdEmail className="absolute left-3 top-3 h-6 w-6" />}
              placeholder="example@gmail.com"
            />
            <InputComponent
              type="password"
              name="password"
              logo={<MdLock className="absolute left-3 top-3 h-6 w-6" />}
              placeholder="*********"
            />
            <InputComponent
              type="text"
              name="name"
              logo={<MdBadge className="absolute left-3 top-3 h-6 w-6" />}
              placeholder="Your first name"
            />
            <InputComponent
              type="text"
              name="username"
              logo={
                <MdContactEmergency className="absolute left-3 top-3 h-6 w-6" />
              }
              placeholder="Your username"
            />

            <button className="col-span-full mb-12 mt-5 h-12 w-full rounded-md bg-indigo-600 text-white">
              Sign Up
            </button>
          </div>

          <div className="flex justify-center">
            <Link
              className="transition-colors hover:text-indigo-600"
              href={"/signin"}
            >
              Already have an account? Log in
            </Link>
          </div>
        </div>
      </form>
    </section>
  );
};

export default Page;
