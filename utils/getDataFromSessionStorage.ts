"use client";

export const getUserId = () => {
  const userId = sessionStorage.getItem("userId");
  return userId;
};
