import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Newmedia",
  description:
    "Social media app that helps you connect and share with the people in your life.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" href="/logo_gray.svg" sizes="16*16" type="image/svg" />
      <body className={inter.className}>
        {children} <Toaster />
      </body>
    </html>
  );
}
