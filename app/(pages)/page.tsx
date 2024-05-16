import { redirect } from "next/navigation";

export default function Home() {
  redirect("/feed");

  return (
    <main className="flex min-h-screen ">
      <div className="w-96 h-96 bg-slate-500"></div>
    </main>
  );
}
