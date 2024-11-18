"use client";

import { useRouter } from "next/navigation";
import DefaultCard from "@/components/DefaultCard";

export default function Home() {
  const router = useRouter();

  return (
    <DefaultCard title="Welcome" showBackButton={false}>
      <p className="text-gray-600 text-center">
        Please sign in or create an account to continue
      </p>

      <div className="space-y-4">
        <button
          onClick={() => router.push("/auth/signin")}
          className="w-full flex justify-center py-2 px-4 bg-gray-100 border border-gray-200 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Sign In
        </button>

        <button
          onClick={() => router.push("/auth/signup")}
          className="w-full flex justify-center py-2 px-4 bg-white border border-gray-200 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Sign Up
        </button>
      </div>
    </DefaultCard>
  );
}
