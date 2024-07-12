"use client";

import { updateCommunityColor } from "@/actions/community";
import { subscribe, unsubscribe } from "@/actions/subscription";
import { ICommunity } from "@/interfaces/community";
import { Colors } from "@/interfaces/user";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdClose, MdDone, MdEdit, MdPerson } from "react-icons/md";

const CommunityProfile = ({ community }: { community: ICommunity }) => {
  const [editColor, setEditColor] = useState(false);
  const [currentColor, setCurrentColor] = useState<Colors>(
    community.profileColor,
  );
  const [userId, setUserId] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState<boolean>();

  useEffect(() => {
    const id = localStorage.getItem("userId");
    setUserId(id);
    if (id)
      setIsFollowing(community.subscribed.some((sub) => sub.userId === +id));
  }, []);

  const bgColor = () => {
    switch (currentColor) {
      case Colors.RED:
        return "bg-red-400";
      case Colors.BLUE:
        return "bg-blue-400";
      case Colors.GREEN:
        return "bg-green-400";
      case Colors.YELLOW:
        return "bg-yellow-400";
      case Colors.ORANGE:
        return "bg-orange-400";
      case Colors.PURPLE:
        return "bg-purple-400";
      case Colors.PINK:
        return "bg-pink-400";
      case Colors.GRAY:
        return "bg-gray-400";
    }
  };

  const handleColorChange = async (color: Colors) => {
    toast.loading("Changing color...");
    const status = await updateCommunityColor(color);
    toast.remove();
    if (status === 200) {
      setCurrentColor(color);
      toast.success("Color changed");
    } else {
      toast.error("Something went wrong");
    }
    setEditColor(false);
  };

  const handleSubscribe = async () => {
    if (isFollowing) {
      toast.loading("Unsubscribing...");
      const res = await unsubscribe(community.id);
      toast.remove();

      if (res.error || res.message) {
        toast.error("Something went wrong");
      } else {
        toast.success("Unsubscribed");
        setIsFollowing(false);
      }
    } else {
      toast.loading("Subscribing...");
      const res = await subscribe(community.id);
      toast.remove();

      if (res.error || res.message) {
        toast.error("Something went wrong");
      } else {
        toast.success("Subscribed");
        setIsFollowing(true);
      }
    }
  };

  return (
    <section
      className={`relative z-0 flex h-[300px] w-full items-center justify-between overflow-hidden rounded-md ${community && bgColor()}`}
    >
      <div
        className={`absolute right-0 top-4 mr-3 w-[280px] space-y-2 text-right ${userId && +userId === community.userId ? "block" : "hidden"}`}
      >
        <div className="flex h-10 justify-end opacity-70">
          <button
            onClick={() => setEditColor(true)}
            className={`${editColor ? "hidden" : "flex items-center justify-center"} h-10 rounded-full border-2 bg-gray-600 p-2 text-white opacity-70 shadow-md transition-colors hover:bg-gray-500`}
          >
            <MdEdit /> <span className="ml-1">Change Color</span>
          </button>
          <button
            onClick={() => {
              handleColorChange(currentColor);
            }}
            className={`${editColor ? "flex items-center justify-center" : "hidden"} h-10 rounded-full border-2 bg-green-600 p-2 text-white opacity-70 shadow-md transition-colors hover:bg-green-700`}
          >
            <MdDone /> <span className="ml-1">Accept</span>
          </button>
          <button
            onClick={() => setEditColor(false)}
            className={`${editColor ? "flex items-center justify-center" : "hidden"} h-10 rounded-full border-2 bg-red-600 p-2 text-white opacity-70 shadow-md transition-colors hover:bg-red-700`}
          >
            <MdClose /> <span className="ml-1">Back</span>
          </button>
        </div>

        <div
          className={`${editColor ? "flex" : "hidden"} space-x-3 transition-opacity duration-300`}
        >
          <button
            className="h-6 w-6 cursor-pointer rounded-full bg-red-500 shadow-md"
            onClick={() => setCurrentColor(Colors.RED)}
          ></button>
          <button
            className="h-6 w-6 cursor-pointer rounded-full bg-blue-500 shadow-md"
            onClick={() => setCurrentColor(Colors.BLUE)}
          ></button>
          <button
            className="h-6 w-6 cursor-pointer rounded-full bg-green-500 shadow-md"
            onClick={() => setCurrentColor(Colors.GREEN)}
          ></button>
          <button
            className="h-6 w-6 cursor-pointer rounded-full bg-yellow-500 shadow-md"
            onClick={() => setCurrentColor(Colors.YELLOW)}
          ></button>
          <button
            className="h-6 w-6 cursor-pointer rounded-full bg-orange-500 shadow-md"
            onClick={() => setCurrentColor(Colors.ORANGE)}
          ></button>
          <button
            className="h-6 w-6 cursor-pointer rounded-full bg-purple-500 shadow-md"
            onClick={() => setCurrentColor(Colors.PURPLE)}
          ></button>
          <button
            className="h-6 w-6 cursor-pointer rounded-full bg-pink-500 shadow-md"
            onClick={() => setCurrentColor(Colors.PINK)}
          ></button>
          <button
            className="h-6 w-6 cursor-pointer rounded-full bg-gray-500 shadow-md"
            onClick={() => setCurrentColor(Colors.GRAY)}
          ></button>
        </div>
      </div>

      <div className="absolute bottom-0 z-0 flex h-2/5 w-full rounded-md bg-white">
        <div className="absolute bottom-[60px] flex w-full justify-between px-1.5 ms:px-4 sm:px-2 md:px-6">
          <div className="flex w-full space-x-1 sm:space-x-4">
            <div className="flex h-28 w-28 items-start justify-center overflow-hidden rounded-md border-4 border-white bg-gray-200 ms:h-36 ms:w-36">
              {community?.imageUrl ? (
                <Image
                  width={100}
                  height={100}
                  alt="Profile Photo"
                  src={community.imageUrl}
                  className="h-full w-full rounded-md"
                />
              ) : (
                <MdPerson
                  className="border text-gray-400 sm:h-44 sm:w-44"
                  style={{ width: "120%", height: "120%" }}
                />
              )}
            </div>

            <div className="mb-5 flex items-center justify-between self-end">
              <div>
                <h1 className="text-2xl font-bold">{community.name}</h1>
              </div>
            </div>
          </div>

          {userId ? (
            +userId === community.userId ? (
              <Link type="button" href={`edit`} className="btn-blue">
                Edit Profile
              </Link>
            ) : (
              <button
                className={`${isFollowing ? "btn-red" : "btn-blue"}`}
                onClick={() => handleSubscribe()}
              >
                {isFollowing ? "Unsubscribe" : "Subscribe"}
              </button>
            )
          ) : (
            <button
              type="button"
              disabled
              className="border-text mb-3 flex h-fit min-w-32 animate-pulse cursor-pointer items-center justify-center self-end rounded-sm border-2 border-blue-300 bg-gray-100 px-1 py-2 text-sm font-bold capitalize leading-6 transition-colors ms:p-2"
            >
              Loading...
            </button>
          )}
        </div>
        <p className="absolute bottom-1 left-1 text-gray-500">
          {community?.description || "No description specified"}
        </p>
      </div>
    </section>
  );
};

export default CommunityProfile;
