"use client";

import type React from "react";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Define the session type
export interface Session {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  role: string;
}

// Define the auth context type
interface AuthContextType {
  session: Session | null;
  status: "loading" | "authenticated" | "unauthenticated";
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Create the auth context
const AuthContext = createContext<AuthContextType>({
  session: null,
  status: "loading",
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<
    "loading" | "authenticated" | "unauthenticated"
  >("loading");
  const router = useRouter();

  // Fetch session on mount
  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch("/api/auth/session");

        if (res.ok) {
          const data = await res.json();
          setSession(data.session);
          setStatus(data.session ? "authenticated" : "unauthenticated");
        } else {
          setStatus("unauthenticated");
        }
      } catch (error) {
        console.error("Error fetching session:", error);
        setStatus("unauthenticated");
      }
    }

    fetchSession();
  }, []);
  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const responseText = await res.text();

      if (!res.ok) {
        let errorMessage = "Login failed";
        try {
          const errorJson = JSON.parse(responseText);
          errorMessage = errorJson.message || errorMessage;
        } catch (e) {
          errorMessage = responseText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = JSON.parse(responseText);
      setSession(data.session);
      setStatus("authenticated");
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const responseText = await res.text(); // First get the response as text

      if (!res.ok) {
        let errorMessage = "Registration failed";
        try {
          // Try to parse as JSON
          const errorJson = JSON.parse(responseText);
          errorMessage = errorJson.message || errorMessage;
        } catch (e) {
          // If not JSON, use the raw text
          errorMessage = responseText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      await login(email, password);
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };
  // Logout function
  const logout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Logout failed");
      }

      setSession(null);
      setStatus("unauthenticated");
      router.refresh();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ session, status, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  return useContext(AuthContext);
}
