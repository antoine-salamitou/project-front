"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import { withAuth } from "@/components/withProtectedRoute";
import DefaultCard from "@/components/DefaultCard";

const HomePage = () => {
  const { user, clearAuth } = useAuth();
  const router = useRouter();

  return (
    <DefaultCard
      title="Your Profile"
      onBackClick={() => router.back()}
      showBackButton={false}
    >
      <section className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-sm font-medium text-gray-500">Email</span>
              <p className="text-gray-700">{user?.email}</p>
            </div>
            <div className="space-y-1">
              <span className="text-sm font-medium text-gray-500">About</span>
              <p className="text-gray-700">{user?.aboutMe || "Not provided"}</p>
            </div>
            <div className="space-y-1">
              <span className="text-sm font-medium text-gray-500">DOB</span>
              <p className="text-gray-700">
                {user?.birthDate || "Not provided"}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-sm font-medium text-gray-500">Address</span>
              <p className="text-gray-700">{user?.address || "Not provided"}</p>
            </div>
            <div className="space-y-1">
              <span className="text-sm font-medium text-gray-500">City</span>
              <p className="text-gray-700">{user?.city || "Not provided"}</p>
            </div>
            <div className="space-y-1">
              <span className="text-sm font-medium text-gray-500">State</span>
              <p className="text-gray-700">{user?.state || "Not provided"}</p>
            </div>
            <div className="space-y-1">
              <span className="text-sm font-medium text-gray-500">ZIP</span>
              <p className="text-gray-700">{user?.zip || "Not provided"}</p>
            </div>
          </div>
        </div>
      </section>

      <button
        onClick={() => {
          clearAuth();
          router.push("/");
        }}
        className="w-full flex justify-center py-2 px-4 bg-gray-100 border border-gray-200 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        Sign Out
      </button>

      <div className="text-sm text-gray-500 text-center">
        Manage your profile and account settings
      </div>
    </DefaultCard>
  );
};

export default withAuth(HomePage);
