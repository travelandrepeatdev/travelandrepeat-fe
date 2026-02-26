// src/auth/AuthContext.tsx
import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useState } from "react";

type UserProfile = {
    userId: string;
    name: string;
    avatar_url: string;
    role: string;
    permissions: string[];
};

type AuthContextType = {
  token: string | null;
  user: UserProfile | null;
  login: (token: string, user: UserProfile) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();

  const login = (jwt: string, profile: UserProfile) => {
    setToken(jwt);
    setUser(profile);

    // optional persistence
    localStorage.setItem("accessToken", jwt);
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("accessToken");

    await axios.post(apiBaseUrl + "/auth/logout")
      .then(() => {
        console.log("Logout successful");
      }).catch((error) => {
        console.error("Logout API Error:", error);
      });

    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
