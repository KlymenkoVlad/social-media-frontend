import Head from "next/head";
import Link from "next/link";

const Help = () => {
  return (
    <main className="w-full px-1 md:px-5">
      <Head>
        <title>Help - Newmedia</title>
      </Head>
      <div className="flex min-h-screen flex-col items-center p-6">
        <header className="mb-10 text-center">
          <h1 className="mb-2 text-4xl font-bold">Newmedia Help Center</h1>
          <p className="text-lg text-gray-600">Your guide to using Newmedia</p>
        </header>
        <main className="w-full max-w-2xl">
          <section className="mb-6 rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-2 text-2xl font-semibold">Getting Started</h2>
            <p className="text-gray-700">
              Learn the basics of setting up your Newmedia account and making
              your first post is easy. Our site is similar to another social
              media
            </p>
          </section>
          <section className="mb-6 rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-2 text-2xl font-semibold">Account Settings</h2>
            <p className="text-gray-700">
              Manage your account settings and privacy preferences.
            </p>
            <Link
              className="mt-4 inline-block text-blue-500 hover:underline"
              href="/settings"
            >
              Change Settings
            </Link>
          </section>
          <section className="mb-6 rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-2 text-2xl font-semibold">Troubleshooting</h2>
            <p className="text-gray-700">
              Find solutions to common issues and problems.
            </p>
            <Link
              className="mt-4 inline-block text-blue-500 hover:underline"
              href="emailto:2zG6H@example.com"
            >
              Read More
            </Link>
          </section>
        </main>
        <footer className="mt-auto py-6 text-center text-gray-500">
          <p>&copy; 2024 Newmedia. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
};

export default Help;
