"use client";

import React, { useEffect, useState } from "react";
import type { UserData } from "@/types";
import { useRouter } from "next/navigation";
import DefaultCard from "@/components/DefaultCard";
import { useAuth } from "@/contexts/authContext";

export default function DataPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { authToken } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users`
        );
        const data = await response.json();
        if (response.ok) {
          setUsers(data);
        } else {
          setError(data.message || "An error occurred");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("An error occurred");
      }
    };
    fetchUsers();

    // Set up polling to refresh data every 5 seconds
    const interval = setInterval(fetchUsers, 5000);
    return () => clearInterval(interval);
  }, []);

  // Format address object into a readable string
  const formatAddress = (user: UserData) => {
    if (!user.address) return "N/A";
    return [user.address, user.city, user.state, user.zip]
      .filter(Boolean)
      .join(", ");
  };

  // Format date to locale string
  const formatDate = (date?: string) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  return (
    <DefaultCard
      title="User Data"
      onBackClick={() => (authToken ? router.push("/home") : router.push("/"))}
      className="overflow-x-auto"
    >
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}
      <div className="mt-4 text-sm text-gray-500">
        This table automatically updates every 5 seconds
      </div>
      <table className="min-w-full table-auto border-collapse bg-white shadow-sm rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              About
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Address
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Birthdate
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Created At
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.map((user) => (
            <tr
              key={user.email}
              className="hover:bg-gray-50 transition-colors duration-150"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="font-medium text-gray-900">{user.email}</span>
              </td>
              <td className="px-6 py-4">
                <div className="max-w-xs overflow-hidden text-ellipsis text-gray-500">
                  {user.aboutMe || "N/A"}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="max-w-xs overflow-hidden text-ellipsis text-gray-500">
                  {formatAddress(user)}
                </div>
              </td>
              <td className="px-6 py-4 text-gray-500">
                {formatDate(user.birthDate)}
              </td>
              <td className="px-6 py-4 text-gray-500">
                {formatDate(user.createdAt)}
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td
                colSpan={5}
                className="px-6 py-8 text-center text-gray-500 bg-gray-50"
              >
                No user data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </DefaultCard>
  );
}
