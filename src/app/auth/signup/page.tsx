"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ProgressBar } from "@/components/ProgressBar";
import { useAuth } from "@/contexts/authContext";
import DefaultCard from "@/components/DefaultCard";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAuth } = useAuth();
  const [error, setError] = useState("");
  const [totalStepCount, setTotalStepCount] = useState(3);

  useEffect(() => {
    const fetchTotalStepCount = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/onboarding/info`
      );
      const data = await response.json();
      setTotalStepCount(data.totalStepCount);
    };
    fetchTotalStepCount();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/sign-up`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        const { token, user } = data;
        await setAuth(token, user);
        router.push(`/onboarding`);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      setError("An error occurred");
    }
  };

  return (
    <DefaultCard title="Create Account" onBackClick={() => router.push("/")}>
      <div className="w-full space-y-8">
        <div>
          <ProgressBar currentStep={1} totalSteps={totalStepCount} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-sm text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-4 py-2 border border-gray-200 rounded text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full px-4 py-2 border border-gray-200 rounded text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose a password"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 bg-gray-100 border border-gray-200 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </DefaultCard>
  );
}
