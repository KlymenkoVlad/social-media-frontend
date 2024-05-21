import React from "react";

const page = ({ params }: { params: { username: string } }) => {
  return <div>{params.username}</div>;
};

export default page;
