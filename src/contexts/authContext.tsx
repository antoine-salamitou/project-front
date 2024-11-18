"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useRef,
} from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { UserData } from "@/types";

interface AuthState {
  authToken: string;
  user: UserData;
}

interface AuthContextType extends AuthState {
  setAuth: (token: string, user: UserData) => Promise<void>;
  clearAuth: () => Promise<void>;
  updateUser: (user: UserData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  authToken: "",
  user: {},
  setAuth: async () => {},
  clearAuth: async () => {},
  updateUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const hasAuthed = useRef(false);

  const [authState, setAuthState] = useState<AuthState>({
    authToken: "",
    user: {},
  });

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        hasAuthed.current = true;

        const token = localStorage.getItem("authToken");

        if (!token) {
          return;
        }

        setAuthState((authState) => ({
          ...authState,
          authToken: token,
        }));

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const { hasCompletedOnboarding, user: updatedUser } =
          await response.json();

        setAuthState((authState) => ({
          ...authState,
          user: updatedUser,
        }));

        if (!hasCompletedOnboarding) {
          router.push(`/onboarding`);
        } else {
          router.push("/home");
        }
      } catch (error) {
        console.error("Error fetching onboarding status:", error);
        router.push("/home");
      }
    };

    if (pathname === "/data" || pathname === "/admin" || hasAuthed.current) {
      return;
    }

    checkAuthStatus().catch((error) => {
      console.warn("Error checking auth status:", error);
    });
  }, [router, pathname]);

  const setAuth = useCallback(async (token: string, user: UserData) => {
    try {
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));

      setAuthState({
        authToken: token,
        user,
      });
    } catch (error) {
      console.error("Error setting auth:", error);
    }
  }, []);

  const updateUser = useCallback(async (user: UserData) => {
    localStorage.setItem("user", JSON.stringify(user));
    setAuthState((authState) => ({
      ...authState,
      user,
    }));
  }, []);

  const clearAuth = useCallback(async () => {
    try {
      localStorage.removeItem("authToken");
      setAuthState({
        authToken: "",
        user: {},
      });
    } catch (error) {
      console.error("Error clearing auth:", error);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ ...authState, setAuth, clearAuth, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
