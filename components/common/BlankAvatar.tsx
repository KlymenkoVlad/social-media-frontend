import { Person } from "@mui/icons-material";
import React from "react";

const BlankAvatar = () => {
  const style = `absolute w-12 h-12 text-gray-400 `;

  return (
    <div className="rounded-full bg-gray-200 h-10 w-10 relative overflow-hidden justify-center items-start flex">
      <Person className={style} />
    </div>
  );
};

export default BlankAvatar;
