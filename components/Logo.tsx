import Image from "next/image";
import React from "react";

interface LogoProps {
  width?: number;
  height?: number;
}

const Logo = ({ width = 30, height = 30 }: LogoProps): JSX.Element => {
  return <Image src={"/logo.svg"} alt="logo" width={width} height={height} />;
};

export default Logo;
