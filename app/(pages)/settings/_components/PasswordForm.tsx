"use client";

// import { updatePassword } from "@/actions/user";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { MdLockClock, MdLockOpen } from "react-icons/md";
import { z } from "zod";

const FormDataSchema = z.object({
  oldPassword: z.string().min(5, "Password must be at least 5 characters"),
  newPassword: z.string().min(5, "Password must be at least 5 characters"),
});

import { updatePassword } from "@/actions/user";

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
        <h1 className="col-span-2 mb-4 text-center text-3xl font-bold">
          Change Your Password
        </h1>
        <InputComponent
          type="password"
          name="oldPassword"
          logo={<MdLockOpen className="absolute left-3 top-3 h-6 w-6" />}
          placeholder="Your old password"
        />
        <InputComponent
          type="password"
          name="newPassword"
          logo={<MdLockClock className="absolute left-3 top-3 h-6 w-6" />}
          placeholder="Your new password"
        />

        <button className="btn-blue col-span-2" type="submit">
          Save
        </button>
      </form>
    </div>
  );
};

export default PasswordForm;
