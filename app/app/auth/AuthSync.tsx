"use client";

import { useEffect } from "react";
import { defaultApiAuth } from "../lib/api";
import { useAuth } from "./AuthContext";

export function AuthSync() {
  const { login, logout } = useAuth();

  useEffect(() => {
    defaultApiAuth.getProfile().then((user) => {
        login(user as any);
    }).catch(() => {
      logout();
    });
  }, []);

  return null;
}