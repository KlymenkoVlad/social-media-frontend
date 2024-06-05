"use client";

//* TODO
//* Add image upload

import { sendData } from "@/app/_actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge, ContactEmergency, Email, Lock } from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const FormDataSchemaSignup = z.object({
  email: z.string().email("Invalid email"),
  name: z.string().min(1, "Name is required"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .toLowerCase(),
  password: z.string().min(5, "Password must be at least 5 characters"),

  // surname: z.string().nullable(),

  // age: z.number().nullable(),

  // imageUrl: z.string().nullable(),

  // description: z.string().nullable(),
});

type Inputs = z.infer<typeof FormDataSchemaSignup>;

const Page = () => {
  const InputComponent = ({
    type,
    placeholder,
    name,
    logo,
  }: {
    type: string;
    placeholder: string;
    name: keyof Inputs;
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

  const router = useRouter();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(FormDataSchemaSignup),
  });

  const processForm: SubmitHandler<Inputs> = async (data) => {
    toast.loading("Creating your account...");
    const { response, user } = await sendData(data, "signup");

    toast.remove();
    if (response.error) {
      if (response.statusCode === 409) {
        toast.error("User already exists");
        return;
      }

      if (response.statusCode === 400 && response.message[0]) {
        toast.error(response.message[0]);
        return;
      }

      toast.error("Something went wrong");
      return;
    }

    if (user) {
      localStorage.setItem("userId", user.id);
      localStorage.setItem("username", user.username);
    }

    toast.success("Your account has been successful created");
    router.push("/feed");

    reset();
  };

  return (
    <section className="h-dvh w-dvw px-2 py-10">
      <form onSubmit={handleSubmit(processForm)} className="flex h-full w-full">
        <div className="hidden w-1/2 p-10 md:block">
          <Image
            src={"/signin_illustration.svg"}
            className="h-full min-w-full max-w-full rounded-sm"
            width={80}
            height={80}
            quality={100}
            alt="image"
          />
        </div>

        <div className="w-full place-content-center p-5">
          <h1 className="mb-8 text-3xl font-semibold">
            Welcome back to <br />
            <span className="font-extrabold text-indigo-600">Newmedia</span>
          </h1>
          <h2 className="mb-5 text-xl font-semibold"></h2>

          <div className="grid grid-cols-2 gap-x-10 gap-y-8">
            <InputComponent
              type="email"
              name="email"
              logo={<Email className="absolute left-3 top-3" />}
              placeholder="example@gmail.com"
            />
            <InputComponent
              type="password"
              name="password"
              logo={<Lock className="absolute left-3 top-3" />}
              placeholder="*********"
            />
            <InputComponent
              type="text"
              name="name"
              logo={<Badge className="absolute left-3 top-3" />}
              placeholder="Your first name"
            />
            <InputComponent
              type="text"
              name="username"
              logo={<ContactEmergency className="absolute left-3 top-3" />}
              placeholder="Your username"
            />

            <button className="col-span-2 mb-12 mt-5 h-12 w-full rounded-md bg-indigo-600 text-white">
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
