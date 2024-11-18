import React from "react";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between mb-2">
        {Array.from({ length: totalSteps }).map((_, idx) => (
          <div
            key={idx}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              idx < currentStep ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {idx + 1}
          </div>
        ))}
      </div>
      <div className="h-2 bg-gray-200 rounded">
        <div
          className="h-full bg-blue-500 rounded transition-all"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
}
