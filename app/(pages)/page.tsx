import { redirect } from "next/navigation";

export default function Home() {
  redirect("/feed");

  return (
    <main className="flex min-h-screen">
      <div className="h-96 w-96 bg-slate-500"></div>
    </main>
  );
}
