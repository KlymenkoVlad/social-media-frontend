"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { redirectToFeed } from "../redirectToFeed";
import { MdEmail, MdLock } from "react-icons/md";
import { login } from "@/actions/auth";

const FormDataSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(5, "Password must be at least 5 characters"),
});

export type SignInInputs = z.infer<typeof FormDataSchema>;

const Page = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignInInputs>({
    resolver: zodResolver(FormDataSchema),
  });

  const processForm: SubmitHandler<SignInInputs> = async (data) => {
    toast.loading("Looking for your account...");
    const { res, user } = await login(data);

    toast.remove();
    if (res.error) {
      toast.error("Wrong credentials");
    } else {
      if (user) {
        localStorage.setItem("userId", user.id.toString());
        localStorage.setItem("username", user.username);
      }

      toast.success("Login successful");

      redirectToFeed();
    }

    reset();
  };

  return (
    <section className="h-dvh w-dvw p-0 ms:p-8">
      <form
        onSubmit={handleSubmit(processForm)}
        className="mx-auto flex h-full w-full max-w-[1300px]"
      >
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
        <div className="w-full place-content-center rounded-md bg-white p-3 ms:p-8 md:w-1/2">
          <h1 className="mb-8 text-3xl font-semibold">
            Welcome back to <br />
            <span className="font-extrabold text-indigo-600">Newmedia</span>
          </h1>
          <h2 className="mb-5 text-xl font-semibold"></h2>

          <div className="relative mb-10">
            <input
              type="text"
              className="mb-1 h-12 w-full rounded-md bg-gray-300 ps-14 focus:outline-none"
              placeholder="example@gmail.com"
              {...register("email")}
            />
            <MdEmail className="absolute left-3 top-3 h-6 w-6" />
            {errors.email && (
              <p className="absolute left-0 top-full text-sm text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="relative mb-8">
            <input
              type="password"
              className="mb-1 h-12 w-full rounded-md bg-gray-300 ps-14 focus:outline-none"
              placeholder="*********"
              {...register("password")}
            />
            <MdLock className="absolute left-3 top-3 h-6 w-6" />
            {errors.password && (
              <p className="absolute left-0 top-full text-sm text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>

          <button className="mb-12 mt-5 h-12 w-full rounded-md bg-indigo-600 text-white transition-colors hover:bg-indigo-700">
            Sign in
          </button>

          <div className="flex justify-center">
            <Link
              className="transition-colors hover:text-indigo-600"
              href={"/signup"}
            >
              Don’t have an account? Register
            </Link>
          </div>
        </div>
      </form>
    </section>
  );
};

export default Page;
