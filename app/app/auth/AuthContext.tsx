import { useRouter } from "next/navigation";
import { createContext, useContext, useState } from "react";
import { defaultApiAuth } from "../lib/api";
import { UserProfile } from "../lib/types";

type AuthContextType = {
  user: UserProfile | null;
  login: (user: UserProfile) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const login = (user: UserProfile) => {
    setUser(user);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await defaultApiAuth.postLogout();
      console.log("Logout successful");
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error("Logout API Error:", error);
    }
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
