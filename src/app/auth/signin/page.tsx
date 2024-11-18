"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import DefaultCard from "@/components/DefaultCard";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setAuth } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/sign-in`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await result.json();
      const { token, hasCompletedOnboarding, user } = data;

      if (!token) {
        setError("Invalid credentials");
      } else {
        await setAuth(token, user);

        if (!hasCompletedOnboarding) {
          router.push(`/onboarding`);
        } else {
          router.push("/home");
        }
      }
    } catch (error) {
      console.error("Error signing in:", error);
      setError("An error occurred during sign in");
    }
  };

  return (
    <DefaultCard
      title="Sign in to your account"
      onBackClick={() => router.push("/")}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-2 border border-gray-200 rounded text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-2 border border-gray-200 rounded text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 bg-gray-100 border border-gray-200 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Sign in
        </button>
      </form>

      <div className="text-sm text-gray-500">
        Please enter your credentials to access your account
      </div>
    </DefaultCard>
  );
}
