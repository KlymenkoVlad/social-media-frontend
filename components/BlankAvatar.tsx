import { Person } from "@mui/icons-material";
import Image from "next/image";
import React from "react";

const BlankAvatar = ({ imageSrc }: { imageSrc?: string | null }) => {
  const style = `absolute  text-gray-400 `;

  return (
    <div className="relative flex h-10 w-10 items-start justify-center overflow-hidden rounded-full bg-gray-200">
      {imageSrc ? (
        <Image width={100} height={100} src={imageSrc} alt="Profile Photo" />
      ) : (
        <Person className={style} style={{ width: "48px", height: "48px" }} />
      )}
    </div>
  );
};

export default BlankAvatar;
