"use client";

import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { publicApi } from "@/app/app/lib/api";

const STORAGE_KEY = "usd_mxn_rate";

export function CurrencyIndicator( {mobileMenuOpen} : {mobileMenuOpen: boolean} ) {
  const [usdToMxn, setUsdToMxn] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isBusinessHour = () => {
    const hour = new Date().getHours();
    const day = new Date().getDay();
    const sundayDay = 0;
    return hour >= 9 && hour < 18 && day != sundayDay;
  };

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const cached = sessionStorage.getItem(STORAGE_KEY);
        if (cached) {
          setUsdToMxn(cached);
          setIsLoading(false);
          return;
        }

        if (!isBusinessHour()) {
          setIsLoading(false);
          return;
        }

        const data = await publicApi.getDollarRate();
        sessionStorage.setItem(STORAGE_KEY, data);
        setUsdToMxn(data);
      } catch (error) {
        console.error("Error fetching currency rate:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRate();
  }, []);

  if (isLoading || !usdToMxn) {
    if (mobileMenuOpen) {
      return <div className="text-xs text-muted-foreground">USD/MXN: $ --.--</div>;
    }
    return <div className="text-xs text-muted-foreground" style={{ animation: `fadeInUp 0.5s ease-out ${3*0.1}s forwards`}} >USD/MXN: $ --.--</div>;
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
