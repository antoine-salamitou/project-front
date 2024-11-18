"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { ProgressBar } from "@/components/ProgressBar";
import { AboutMe, Address, Birthdate } from "@/components/FormComponents";
import type { UserData } from "@/types";
import { useAuth } from "@/contexts/authContext";
import { withAuth } from "@/components/withProtectedRoute";
import DefaultCard from "@/components/DefaultCard";

type OnboardingData = {
  name: string;
};

const OnboardingPage = () => {
  const { authToken, updateUser } = useAuth();
  const router = useRouter();
  const [onboardingComponents, setOnboardingComponents] = useState<
    OnboardingData[]
  >([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalStepCount, setTotalStepCount] = useState(0);
  const [userData, setUserData] = useState<UserData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchData = useCallback(async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/onboarding`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();

    if (response.ok) {
      const { onboardingComponents, user, currentStep, totalStepCount } = data;
      setOnboardingComponents(onboardingComponents);
      setUserData(user);
      setCurrentStep(currentStep);
      setTotalStepCount(totalStepCount);
    } else {
      setErrors({ message: data.message || "An error occurred" });
    }
  }, [authToken]);

  useEffect(() => {
    if (!authToken) {
      return;
    }
    fetchData();
  }, [authToken, fetchData]);

  const validateFields = () => {
    const newErrors: Record<string, string> = {};

    onboardingComponents.forEach((component) => {
      switch (component.name) {
        case "aboutMe":
          if (!userData.aboutMe?.trim()) {
            newErrors.aboutMe = "About Me is required";
          }
          break;
        case "address":
          if (!userData.address?.trim())
            newErrors.address = "Address is required";
          if (!userData.city?.trim()) newErrors.city = "City is required";
          if (!userData.state?.trim()) newErrors.state = "State is required";
          if (!userData.zip?.trim()) newErrors.zip = "ZIP code is required";
          break;
        case "birthDate":
          if (!userData.birthDate)
            newErrors.birthDate = "Birth date is required";
          break;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitOnboardingStep = async () => {
    if (!validateFields()) {
      return;
    }
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/onboarding`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          user: userData,
          onboardingComponents,
        }),
      }
    );
    if (response.ok) {
      const onboardingStatusResponse = await response.json();
      const { hasCompletedOnboarding, user } = onboardingStatusResponse;
      await updateUser(user);

      if (!hasCompletedOnboarding) {
        fetchData();
      } else {
        router.push("/home");
      }
    } else {
      console.error(response.statusText);
      setErrors({ message: response.statusText || "An error occurred" });
    }
  };

  const renderErrors = () => {
    if (Object.keys(errors).length === 0) return null;

    return (
      <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded">
        <h3 className="font-medium mb-2">Please fix the following errors:</h3>
        <ul className="list-disc list-inside">
          {Object.entries(errors).map(([field, message]) => (
            <li key={field}>{message}</li>
          ))}
        </ul>
      </div>
    );
  };

  if (!onboardingComponents) return <div>Loading...</div>;

  return (
    <DefaultCard
      title="Complete Your Profile"
      onBackClick={() => router.push("/")}
    >
      <div className="max-w-md mx-auto space-y-6">
        <div className="mb-6">
          <ProgressBar currentStep={currentStep} totalSteps={totalStepCount} />
        </div>

        {renderErrors()}

        <div className="space-y-6">
          {onboardingComponents.map((component) => {
            switch (component.name) {
              case "aboutMe":
                return (
                  <AboutMe
                    key="aboutMe"
                    value={userData.aboutMe || ""}
                    onChange={(value) =>
                      setUserData({ ...userData, aboutMe: value })
                    }
                  />
                );
              case "address":
                return (
                  <Address
                    key="address"
                    address={userData.address || ""}
                    city={userData.city || ""}
                    state={userData.state || ""}
                    zip={userData.zip || ""}
                    onChange={(value) => setUserData({ ...userData, ...value })}
                  />
                );
              case "birthDate":
                return (
                  <Birthdate
                    key="birthDate"
                    value={userData.birthDate || ""}
                    onChange={(value) =>
                      setUserData({ ...userData, birthDate: value })
                    }
                  />
                );
              default:
                return null;
            }
          })}
        </div>

        <button
          onClick={handleSubmitOnboardingStep}
          className="w-full flex justify-center py-2 px-4 bg-gray-100 border border-gray-200 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Continue
        </button>
      </div>
    </DefaultCard>
  );
};

export default withAuth(OnboardingPage);
