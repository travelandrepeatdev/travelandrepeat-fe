"use client";

import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

export function CurrencyIndicator() {
  const [usdToMxn, setUsdToMxn] = useState("--.--");
  const [isLoading, setIsLoading] = useState(true);

  const isBusinessHour = () => {
    const now = new Date();
    const hour = now.getHours(); // 0–23
    return hour >= 9 && hour < 18;
  };

  useEffect(() => {
    const fetchRate = async () => {
      if (!isBusinessHour()) {
        console.info("Outside business hours (9am - 6pm), skipping fetch");
        setIsLoading(false);
        return;
      }

      try {
        console.info("Fetching currency rate...");
        const response = await axios.get(
          "http://localhost:8080/api/dollar/rate"
        );

        if (response.data) {
          setUsdToMxn(response.data);
          console.info("Currency rate fetched:", response.data);
        }
      } catch (error) {
        console.error("Error fetching currency rate:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRate();
    const interval = setInterval(fetchRate, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (!usdToMxn || isLoading) {
    return "--.--";
  }

  return (
    <div className="flex items-center gap-2 rounded-full bg-secondary/50 px-3 py-1.5 text-xs font-medium justify-center">
      <TrendingUp className="h-3.5 w-3.5 text-primary" />
      <span className="text-foreground/80">
        {" "}
        USD/MXN: <b>$ {usdToMxn}</b>
      </span>
    </div>
  );
}
