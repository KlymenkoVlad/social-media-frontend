import BlankAvatar from "@/components/BlankAvatar";
import {
  Block,
  HelpOutline,
  KeyboardArrowDown,
  Logout,
  NotificationAddOutlined,
  Notifications,
  NotificationsActive,
  NotificationsActiveOutlined,
  NotificationsOutlined,
  PersonAdd,
  PersonRemove,
  Settings,
} from "@mui/icons-material";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import cookies from "js-cookie";
import { redirect } from "next/navigation";
import {
  changeRequestStatus,
  deleteFriend,
  getAllRequestsToMe,
} from "@/app/_actions";
import toast from "react-hot-toast";
import { FriendRequestStatus } from "@/app/(pages)/profile/[id]/Profile";

interface RequestsProps {
  id: number;
  senderId: number;
  receiverId: number;
  status: "PENDING";
  createdAt: Date;
  updatedAt: Date;
  sender: {
    username: string;
    name: string;
    id: number;
    image_url: string | null;
  };
}

const Person = ({
  username,
  imageSrc,
  name,
  id,
  setRequests,
}: {
  username: string;
  imageSrc: string | null;
  name: string;
  id: number;
  setRequests: React.Dispatch<
    React.SetStateAction<RequestsProps[] | undefined>
  >;
}) => {
  return (
    <li className="flex items-center rounded-md bg-gray-100 p-2">
      {/* <Link
        className="flex items-center rounded-md p-3 transition-colors hover:bg-gray-200"
        href={`/profile/${id}`}
      > */}
      <Link
        href={`/profile/${id}`}
        className="flex w-full items-center rounded-md p-2 transition-colors hover:bg-gray-300"
      >
        <BlankAvatar imageSrc={imageSrc} />
        <div className="ml-3">
          <p className="">{name}</p>
          <p className="text-xs">@{username}</p>
        </div>
      </Link>

      <div className="flex space-x-1">
        <button
          onClick={async () => {
            toast.loading("Accepting friend request...");
            const status = await changeRequestStatus(
              id,
              FriendRequestStatus.ACCEPTED,
            );
            toast.remove();
            if (!status.error) {
              toast.success("Now you are friends");
              setRequests((prev) =>
                prev?.filter((req) => req.sender.id !== id),
              );
              return;
            }

            toast.error("Something went wrong");
          }}
          className="flex h-8 w-10 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-gray-300"
        >
          <PersonAdd className="text-black" />
        </button>
        <button
          onClick={async () => {
            toast.loading("Declining friend request...");
            const status = await deleteFriend(id);
            toast.remove();
            if (status === 200) {
              toast.success("Friend request canceled");
              setRequests((prev) =>
                prev?.filter((req) => req.sender.id !== id),
              );
              return;
            }

            toast.error("Something went wrong");
          }}
          className="flex h-8 w-10 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-gray-300"
        >
          <PersonRemove className="text-black" />
        </button>
        <button
          onClick={async () => {
            toast.loading("Blocking this user...");
            const status = await changeRequestStatus(
              id,
              FriendRequestStatus.DECLINED,
            );
            toast.remove();
            if (!status.error) {
              toast.success("User blocked");
              setRequests((prev) =>
                prev?.filter((req) => req.sender.id !== id),
              );
              return;
            }

            toast.error("Something went wrong");
          }}
          className="flex h-8 w-10 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-gray-300"
        >
          <Block className="text-red-500" />
        </button>
      </div>
    </li>
  );
};

const Modals = () => {
  const [showUserModal, setShowUserModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [requests, setRequests] = useState<RequestsProps[]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data: RequestsProps[] = await getAllRequestsToMe();
      setLoading(false);
      setRequests(data);
    };

    fetchData();
  }, []);

  return (
    <div className="h-full">
      <div className="flex h-full items-center space-x-3">
        <button
          onClick={() => {
            setShowUserModal(false);
            setShowNotificationModal(!showNotificationModal);
          }}
          className="flex h-full w-12 cursor-pointer items-center justify-center transition-colors hover:bg-gray-300"
        >
          {requests && requests?.length > 0 ? (
            showNotificationModal ? (
              <NotificationsActive className="text-black-800" />
            ) : (
              <NotificationsActiveOutlined className="text-black-800" />
            )
          ) : showNotificationModal ? (
            <Notifications className="text-black-800" />
          ) : (
            <NotificationsOutlined className="text-black-800" />
          )}
        </button>
        <button
          onClick={() => {
            setShowNotificationModal(false);
            setShowUserModal(!showUserModal);
          }}
          className="flex h-full w-24 cursor-pointer items-center justify-center transition-colors hover:bg-gray-300"
        >
          <BlankAvatar />
          <KeyboardArrowDown
            className={` ${
              showUserModal ? "rotate-180 text-gray-500" : "text-gray-400"
            }`}
          />
        </button>
      </div>

      <div
        className={`absolute right-[160px] top-16 z-10 h-[300px] w-[250px] transform space-y-6 rounded-md bg-white shadow-md transition-opacity duration-300 ease-in-out ${
          showUserModal ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex w-full items-center p-3">
          <BlankAvatar imageSrc="" />
          <div className="ml-3">
            <p className="">name</p>
            <p className="text-xs text-gray-400">username</p>
          </div>
        </div>

        <Link
          className="flex w-full items-center p-3 transition-colors hover:bg-gray-200"
          onClick={() => setShowUserModal(!showUserModal)}
          href={"/settings"}
        >
          <Settings />
          <p className="ml-2">Settings</p>
        </Link>
        <Link
          className="flex w-full items-center p-3 transition-colors hover:bg-gray-200"
          href={"/my-profile/help"}
        >
          <HelpOutline />
          <p className="ml-2">Help</p>
        </Link>
        <button
          onClick={() => {
            cookies.remove("token");
            redirect("/signin");
          }}
          className="flex w-full items-center p-3 transition-colors hover:bg-gray-200"
        >
          <Logout />
          <p className="ml-2">Sign out</p>
        </button>
      </div>

      <div
        className={`absolute right-[160px] top-16 z-10 h-[300px] w-[350px] transform space-y-6 rounded-md bg-white shadow-md transition-opacity duration-300 ease-in-out ${
          showNotificationModal
            ? "opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <ul className="space-y-4 p-3">
          {!loading ? (
            requests &&
            (requests?.length > 0 ? (
              requests.map((request) => (
                <Person
                  key={request.sender.id}
                  id={request.sender.id}
                  imageSrc={request.sender.image_url}
                  name={request.sender.name}
                  username={request.sender.username}
                  setRequests={setRequests}
                />
              ))
            ) : (
              <div>No requests...</div>
            ))
          ) : (
            <div>Loading...</div>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Modals;
