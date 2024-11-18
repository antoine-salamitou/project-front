import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const DefaultCard = ({
  children,
  title,
  onBackClick,
  showBackButton = true,
  className = "",
}: {
  children: React.ReactNode;
  title: string;
  onBackClick?: () => void;
  showBackButton?: boolean;
  className?: string;
}) => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Card className={`max-w-6xl mx-auto bg-white ${className}`}>
        <CardContent className="p-8 flex flex-col items-center">
          {showBackButton ? (
            <button
              onClick={onBackClick}
              className="self-start mb-4 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
            >
              ← Back
            </button>
          ) : (
            <div className="h-[42px]" />
          )}

          <CardHeader className="p-0 mb-6">
            <h1 className="text-2xl font-bold">{title}</h1>
          </CardHeader>

          <div className="space-y-6 w-full">{children}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DefaultCard;
