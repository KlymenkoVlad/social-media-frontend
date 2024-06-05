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
    <div className="h-full w-full p-2">
      <Image
        width={100}
        height={100}
        className="h-full w-full rounded-md border"
        src={preview?.toString() || ""}
        alt=""
      />
    </div>
  );
};

export default ImagePreview;
