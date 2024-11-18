"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DefaultCard from "@/components/DefaultCard";
import { useAuth } from "@/contexts/authContext";

interface OnboardingComponent {
  name: string;
  stepIndex: number;
  isActive: boolean;
}

type ConfigState = OnboardingComponent[];

export default function AdminPage() {
  const router = useRouter();
  const [components, setComponents] = useState<ConfigState>([]);
  const [availableComponentNames, setAvailableComponentNames] = useState<
    string[]
  >([]);
  const [totalStepCount, setTotalStepCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isUpdatingSteps, setIsUpdatingSteps] = useState(false);
  const { authToken } = useAuth();

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/config`
        );
        const data = await response.json();

        if (response.ok) {
          const { onboardingComponents, totalStepCount } = data;
          setComponents(onboardingComponents);
          setAvailableComponentNames(
            onboardingComponents.map((c: OnboardingComponent) => c.name).sort()
          );
          setTotalStepCount(totalStepCount);
        } else {
          setError(data.message || "Error loadin configuration");
        }
      } catch (error) {
        console.error("Error fetching config:", error);
        setError("Error loading configuration");
      } finally {
        setIsLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleComponentToggle = (
    stepIndex: number,
    componentName: string,
    checked: boolean
  ) => {
    setSuccess(null);
    const newConfig = components.filter((item) => item.name !== componentName);
    setComponents([
      ...newConfig,
      ...(checked ? [{ name: componentName, stepIndex, isActive: true }] : []),
    ]);
  };

  const handleSave = async () => {
    try {
      setError(null);
      setSuccess(null);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/config`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(components),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error saving configuration");
      }

      setSuccess("Configuration saved successfully");
    } catch (error) {
      console.error("Error saving components:", error);
      setError(
        error instanceof Error ? error.message : "Error saving configuration"
      );
    }
  };

  const handleStepCountChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSuccess(null);
    const newStepCount = parseInt(e.target.value);
    setIsUpdatingSteps(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/onboarding/step-count`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stepCount: newStepCount }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error updating step count");
      }

      setTotalStepCount(newStepCount);
      setSuccess("Step count updated successfully");
    } catch (error) {
      console.error("Error updating step count:", error);
      setError(
        error instanceof Error ? error.message : "Error updating step count"
      );
    } finally {
      setIsUpdatingSteps(false);
    }
  };

  if (isLoading) {
    return (
      <DefaultCard title="Loading Configuration" showBackButton={false}>
        <div className="text-sm text-gray-600">Loading configuration...</div>
      </DefaultCard>
    );
  }

  return (
    <DefaultCard
      title="Admin Configuration"
      onBackClick={() => (authToken ? router.push("/home") : router.push("/"))}
      className="shadow-lg"
    >
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-sm text-red-700 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-sm text-green-700 rounded">
          {success}
        </div>
      )}
      <div className="space-y-8">
        <div className="mb-8 flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">
            Total Number of Steps:
          </label>
          <select
            value={totalStepCount}
            onChange={handleStepCountChange}
            disabled={isUpdatingSteps}
            className="mt-1 block w-24 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
          >
            {[1, 2, 3].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
          {isUpdatingSteps && (
            <span className="text-sm text-gray-500">Updating...</span>
          )}
        </div>
        {[...Array(totalStepCount)].map((_, index) => (
          <div key={index + 1} className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Step {index + 1} Components
            </h2>
            <div className="space-y-3">
              {availableComponentNames.map((component) => (
                <label
                  key={component}
                  className="flex items-center space-x-3 text-sm text-gray-600 hover:text-gray-900"
                >
                  <input
                    type="checkbox"
                    checked={components.some(
                      (item) =>
                        item.stepIndex === index + 1 &&
                        item.name === component &&
                        item.isActive
                    )}
                    onChange={(e) =>
                      handleComponentToggle(
                        index + 1,
                        component,
                        e.target.checked
                      )
                    }
                    className="w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-gray-500"
                  />
                  <span>
                    {component.charAt(0).toUpperCase() + component.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex flex-col items-center space-y-4">
        <button
          onClick={handleSave}
          className="w-full max-w-md flex justify-center py-2 px-4 bg-gray-100 border border-gray-200 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Save Configuration
        </button>
        <div className="text-sm text-gray-500">
          Changes will be applied immediately after saving
        </div>
      </div>
    </DefaultCard>
  );
}
