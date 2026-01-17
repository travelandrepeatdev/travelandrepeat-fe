"use client";

import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

const STORAGE_KEY = "usd_mxn_rate";

export function CurrencyIndicator() {
  const [usdToMxn, setUsdToMxn] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isBusinessHour = () => {
    const hour = new Date().getHours();
    return hour >= 9 && hour < 18;
  };

  useEffect(() => {
    const cached = sessionStorage.getItem(STORAGE_KEY);

    if (cached) {
      setUsdToMxn(cached);
      setIsLoading(false);
      return;
    }

    const fetchRate = async () => {
      if (!isBusinessHour()) {
        setIsLoading(false);
        return;
      }

      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const { data } = await axios.get(`${apiBaseUrl}/api/dollar/rate`);

        if (data) {
          sessionStorage.setItem(STORAGE_KEY, data);
          setUsdToMxn(data);
        }
      } catch (error) {
        console.error("Error fetching currency rate:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRate();
  }, []);

  if (isLoading || !usdToMxn) {
    return <div className="text-xs text-muted-foreground">USD/MXN: --.--</div>;
  }

  return (
    <div className="flex items-center gap-2 rounded-full bg-secondary/50 px-3 py-1.5 text-xs font-medium">
      <TrendingUp className="h-3.5 w-3.5 text-primary" />
      <span>
        USD/MXN: <b>$ {usdToMxn}</b>
      </span>
    </div>
  );
}
