import axios from "axios";
import { useAuth } from "../auth/AuthContext";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
});

export function setAuthToken(token: string | null) {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common.Authorization;
  }
};

apiClient.interceptors.response.use((response) => response, (error) => {
  const { logout } = useAuth();
    if (error.response?.status === 401) {
      logout();
    }
  }
);