"use client";

import { usePathname, useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useAuth } from "@/app/app/auth/AuthContext";

const breadcrumbMap: Record<string, string> = {
  "/app": "Inicio",
  "/app/clientes": "Clientes",
  "/app/proveedores": "Proveedores",
  "/app/comisiones": "Comisiones",
  "/app/gastos": "Gastos",
  "/app/promociones": "Promociones",
  "/app/blogs": "Blogs",
  "/app/admin/usuarios": "Usuarios",
  "/app/admin/roles": "Roles",
  "/app/admin/permisos": "Permisos",
  "/app/admin/auditoria": "Auditoría",
};

export function DashboardHeader() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { logout } = useAuth();

  const isAdmin = pathname.includes("/admin/");
  const currentPage = breadcrumbMap[pathname] || "Dashboard";

  const handleLogout = async () => {
    logout();
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/40 px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      <Breadcrumb className="flex-1">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/app">App</BreadcrumbLink>
          </BreadcrumbItem>

          {isAdmin && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/app/admin/usuarios">
                  Admin
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}
          {pathname !== "/app" && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{currentPage}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}

        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 text-sm text-muted-foreground md:flex">
          <User className="h-4 w-4" />
          <span>{user?.role + " " + user?.name}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          title="Cerrar sesión"
        >
          <LogOut className="h-4 w-4" />
          <span className="sr-only">Cerrar sesión</span>
        </Button>
      </div>
    </header>
  );
}
