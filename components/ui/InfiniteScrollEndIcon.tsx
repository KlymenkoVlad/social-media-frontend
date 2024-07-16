import React from "react";
import { MdSelfImprovement } from "react-icons/md";

const InfiniteScrollEndIcon = ({
  end,
  text,
}: {
  end: boolean;
  text: string;
}) => {
  return (
    <section
      className={`${
        end ? "block" : "hidden"
      } mb-32 w-full text-center text-2xl font-semibold`}
    >
      <MdSelfImprovement
        style={{ width: "8rem", height: "8rem" }}
        className="inline"
      />
      <p>Hmmmm... I think there are no more {text} </p>
    </section>
  );
};

export default InfiniteScrollEndIcon;
