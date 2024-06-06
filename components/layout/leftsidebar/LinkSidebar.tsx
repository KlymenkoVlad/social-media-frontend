"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
const LinkSidebar = () => {
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    setId(localStorage.getItem("userId"));
  }, []);

  return (
    <Link href={`/profile/${id}`} className="ml-2">
      My Profile
    </Link>
  );
};

export default LinkSidebar;
