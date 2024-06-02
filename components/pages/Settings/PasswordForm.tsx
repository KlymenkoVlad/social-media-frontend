"use client";

import { updatePassword } from "@/app/_actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { LockClock, LockOpen, Password } from "@mui/icons-material";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const FormDataSchema = z.object({
  oldPassword: z.string().min(5, "Password must be at least 5 characters"),
  newPassword: z.string().min(5, "Password must be at least 5 characters"),
});

export type PasswordFormInputs = z.infer<typeof FormDataSchema>;

const PasswordForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormInputs>({
    resolver: zodResolver(FormDataSchema),
  });

  const InputComponent = ({
    type,
    placeholder,
    name,
    logo,
  }: {
    type: string;
    placeholder: string;
    name: keyof PasswordFormInputs;
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

  const processForm = async (data: PasswordFormInputs) => {
    toast.loading("Updating your password...");
    const res = await updatePassword(data);

    toast.remove();
    if (res.statusCode === 200) {
      toast.success(res.message);
    } else if (res.statusCode === 400) {
      toast.error(res.message);
    } else {
      toast.error("Something went wrong");
    }

    reset();
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(processForm)}
        className="grid grid-cols-2 items-center gap-6"
      >
        <h1 className="text-3xl font-bold text-center mb-4 col-span-2">
          Change Your Password
        </h1>
        <InputComponent
          type="password"
          name="oldPassword"
          logo={<LockOpen className="absolute top-3 left-3" />}
          placeholder="Your old password"
        />
        <InputComponent
          type="password"
          name="newPassword"
          logo={<LockClock className="absolute top-3 left-3" />}
          placeholder="Your new password"
        />

        <button
          className="w-full bg-indigo-600 h-12 rounded-md mt-3 text-white mb-12 col-span-2"
          type="submit"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default PasswordForm;
