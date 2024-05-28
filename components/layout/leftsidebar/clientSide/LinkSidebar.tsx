"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
const LinkSidebar = () => {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    setUsername(localStorage.getItem("username"));
  }, []);

  return (
    <Link href={`/profile/${username}`} className="ml-2">
      My Profile
    </Link>
  );
};

export default LinkSidebar;
