"use client";

import Image from "next/image";
import React, { useState } from "react";

const ImagePreview = ({ file }: { file: File | string }) => {
  const [preview, setPreview] = useState<string | ArrayBuffer | undefined>();

  if (file instanceof File) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setPreview(reader.result?.toString());
    };

    console.log(reader.result?.toString());
  } else if (typeof file === "string") {
    setPreview(file);
  }

  return (
    <div className="p-2 w-full h-full ">
      <Image
        width={100}
        height={100}
        className="border rounded-md w-full h-full"
        src={preview?.toString() || ""}
        alt=""
      />
    </div>
  );
};

export default ImagePreview;
