"use client";

import { useEffect } from "react";
import { setAuthToken } from "../api/apiClient";

export function AuthSync() {

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setAuthToken(token);
  }, []);

  return null;
}
