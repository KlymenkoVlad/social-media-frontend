"use client";

import { sendData } from "@/app/_actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Email, Lock } from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";
const Page = () => {
  const router = useRouter();
  const FormDataSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(5, "Password must be at least 5 characters"),
  });

  type Inputs = z.infer<typeof FormDataSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(FormDataSchema),
  });

  const processForm: SubmitHandler<Inputs> = async (data) => {
    toast.loading("Looking for your account...");
    const { response, user } = await sendData(data, "login");

    toast.remove();
    if (response.error) {
      toast.error("Wrong credentials");
    } else {
      if (user) {
        sessionStorage.setItem("userId", user.id);
        sessionStorage.setItem("username", user.username);
      }

      toast.success("Login successful");
      router.push("/feed");
    }

    reset();
  };

  return (
    <section className="h-dvh w-dvw py-12 ms:px-12 px-4  ">
      <form
        onSubmit={handleSubmit(processForm)}
        className="mx-auto max-w-[1100px] h-full w-full flex shadow-lg"
      >
        <div className="w-1/2 p-10 md:block hidden">
          <Image
            src={"/signin_illustration.svg"}
            className="min-w-full max-w-full h-full rounded-sm "
            width={80}
            height={80}
            quality={100}
            alt="image"
          />
        </div>
        <div className="md:w-1/2 w-full ms:p-12 p-4  place-content-center">
          <h1 className="text-3xl font-semibold mb-8">
            Welcome back to <br />
            <span className="text-indigo-600 font-extrabold">Newmedia</span>
          </h1>
          <h2 className="text-xl font-semibold mb-5"></h2>

          <div className="relative mb-10 ">
            <input
              type="text"
              className="w-full bg-gray-300 h-12 rounded-md ps-14 focus:outline-none mb-1"
              placeholder="example@gmail.com"
              {...register("email")}
            />
            <Email className="absolute top-3 left-3" />
            {errors.email && (
              <p className="text-sm text-red-400 absolute top-full left-0">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="relative mb-8">
            <input
              type="password"
              className="w-full bg-gray-300 h-12 rounded-md ps-14 focus:outline-none mb-1"
              placeholder="*********"
              {...register("password")}
            />
            <Lock className="absolute top-3 left-3" />
            {errors.password && (
              <p className="text-sm text-red-400 absolute top-full left-0">
                {errors.password.message}
              </p>
            )}
          </div>

          <button className="w-full bg-indigo-600 h-12 rounded-md mt-5 text-white mb-12">
            Sign in
          </button>

          <div className="flex justify-center">
            <Link
              className="hover:text-indigo-600 transition-colors"
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
