"use client";
import { useEffect } from "react";
import { useAuth } from "@/contexts/authContext";
import { redirect } from "next/navigation";

export const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  return function WithAuth(props: P) {
    const { authToken } = useAuth();

    useEffect(() => {
      if (!authToken) {
        redirect("/");
      }
    }, []);

    if (!authToken) {
      return null;
    }
    return <WrappedComponent {...props} />;
  };
};
