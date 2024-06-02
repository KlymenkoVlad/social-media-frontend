"use client";

export const getUserId = () => {
  const userId = localStorage.getItem("userId");
  return userId;
};
