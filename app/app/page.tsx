"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Building2, DollarSign, Receipt, Megaphone, TrendingUp, TrendingDown, FileText } from "lucide-react"
import { mockCommissions, mockExpenses, mockAuditLogs } from "./lib/mock-data"
import { apiClient } from "./api/apiClient";
import { Dashboard0, Dashboard1, Dashboard2 } from "./lib/types";
import { useEffect, useState } from "react";
import { useAuth } from "./auth/AuthContext";

export default function App() {
  const [dashboard0, setDashboard0] = useState<Dashboard0>({
    totalClients: "",
    totalProviders: "",
    activePromotions: "",
    publishedBlogs: ""
  });

  const [dashboard1, setDashboard1] = useState<Dashboard1>({
  });

  const [dashboard2, setDashboard2] = useState<Dashboard2>({
  });

  const { user } = useAuth();

  const hasPermissionStats = user?.permissions.includes("DASHBOARD_STATS");
  const hasPermissionFinancial = user?.permissions.includes("DASHBOARD_FINANCIAL");
  const hasPermissionActivity = user?.permissions.includes("DASHBOARD_ACTIVITY");

  useEffect(() => { 
    const fetchDashboard0 = async () => {
      try {
        console.log("Promotions loaded");
        const response = await apiClient.get<Dashboard0>("/dashboard/stats");
        setDashboard0(response.data);
      } catch (err: any) {
        console.error("Failed to load promotions");
      }
    };
    fetchDashboard0();
  }, []);

  const totalCommissionsMXN = mockCommissions
    .filter((c) => c.status !== "Cancelada")
    .reduce((sum, c) => sum + c.amount_mxn, 0);

  const totalCommissionsUSD = mockCommissions
    .filter((c) => c.status !== "Cancelada")
    .reduce((sum, c) => sum + c.amount_usd, 0);

  const totalExpensesMXN = mockExpenses.reduce(
    (sum, e) => sum + e.amount_mxn,
    0,
  );
  const totalExpensesUSD = mockExpenses.reduce(
    (sum, e) => sum + e.amount_usd,
    0,
  );

  const netMXN = totalCommissionsMXN - totalExpensesMXN;
  const netUSD = totalCommissionsUSD - totalExpensesUSD;

  const recentActivity = mockAuditLogs.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground">
          <p>Bienvenido 👋</p>
        </h1>
        <p className="text-muted-foreground mt-1">
          Aquí tienes un resumen de actividad reciente.
        </p>
      </div>

      {/* Stats Cards */}
      {hasPermissionStats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Clientes
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboard0.totalClients}</div>
              <p className="text-xs text-muted-foreground">Total registrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Proveedores
              </CardTitle>
              <Building2 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboard0.totalProviders}
              </div>
              <p className="text-xs text-muted-foreground">Total activos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Promociones
              </CardTitle>
              <Megaphone className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboard0.activePromotions}
              </div>
              <p className="text-xs text-muted-foreground">
                Activas actualmente
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Blogs
              </CardTitle>
              <FileText className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboard0.publishedBlogs}
              </div>
              <p className="text-xs text-muted-foreground">Publicados</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Financial Summary */}
      {hasPermissionFinancial && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="border-green-500/20 bg-green-500/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Comisiones
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                $
                {totalCommissionsMXN.toLocaleString("es-MX", {
                  minimumFractionDigits: 2,
                })}{" "}
                MXN
              </div>
              <p className="text-xs text-muted-foreground">
                $
                {totalCommissionsUSD.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}{" "}
                USD
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-500/20 bg-red-500/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Gastos
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                $
                {totalExpensesMXN.toLocaleString("es-MX", {
                  minimumFractionDigits: 2,
                })}{" "}
                MXN
              </div>
              <p className="text-xs text-muted-foreground">
                $
                {totalExpensesUSD.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}{" "}
                USD
              </p>
            </CardContent>
          </Card>

          <Card
            className={
              netMXN >= 0
                ? "border-primary/20 bg-primary/5"
                : "border-orange-500/20 bg-orange-500/5"
            }
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Balance Neto
              </CardTitle>
              <DollarSign
                className={`h-4 w-4 ${netMXN >= 0 ? "text-primary" : "text-orange-600"}`}
              />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${netMXN >= 0 ? "text-primary" : "text-orange-600"}`}
              >
                ${netMXN.toLocaleString("es-MX", { minimumFractionDigits: 2 })}{" "}
                MXN
              </div>
              <p className="text-xs text-muted-foreground">
                ${netUSD.toLocaleString("en-US", { minimumFractionDigits: 2 })}{" "}
                USD
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Activity */}
      {hasPermissionActivity && (
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Actividad Reciente</CardTitle>
              <CardDescription>
                Últimas acciones registradas en el sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-4 rounded-lg border border-border/50 p-3"
                  >
                    <div
                      className={`mt-0.5 h-2 w-2 rounded-full flex-shrink-0 ${
                        log.action === "CREATE"
                          ? "bg-green-500"
                          : log.action === "UPDATE"
                            ? "bg-blue-500"
                            : "bg-red-500"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {log.details}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {log.user_name} &middot;{" "}
                        {new Date(log.created_at).toLocaleDateString("es-MX", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
