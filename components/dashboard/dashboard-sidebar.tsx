"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CastleIcon, LayoutDashboard, Users, Building2, DollarSign, Receipt, Megaphone, FileText, ShieldCheck, UserCog, KeyRound, ClipboardList, ChevronDown } from "lucide-react"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, SidebarSeparator } from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useEffect, useState } from "react"
import { defaultApiAuth } from "@/app/app/lib/api"
import { useAuth } from "@/app/app/auth/AuthContext"
import { UserProfile } from "@/app/app/lib/types"

const agentMenuItems = [
  { title: "Inicio", href: "/app", icon: LayoutDashboard, permission: "MODULE_DASHBOARD" },
  { title: "Clientes", href: "/app/clientes", icon: Users, permission: "MODULE_CLIENTES" },
  { title: "Proveedores", href: "/app/proveedores", icon: Building2, permission: "MODULE_PROVEEDORES" },
  { title: "Comisiones", href: "/app/comisiones", icon: DollarSign, permission: "MODULE_COMISIONES" },
  { title: "Gastos", href: "/app/gastos", icon: Receipt, permission: "MODULE_GASTOS" },
  { title: "Promociones", href: "/app/promociones", icon: Megaphone, permission: "MODULE_PROMOCIONES" },
  { title: "Blogs", href: "/app/blogs", icon: FileText, permission: "MODULE_BLOGS" },
]

const adminMenuItems = [
  { title: "Usuarios", href: "/app/admin/usuarios", icon: UserCog, permission: "MODULE_USUARIOS" },
  { title: "Roles", href: "/app/admin/roles", icon: ShieldCheck, permission: "MODULE_ROLES" },
  { title: "Permisos", href: "/app/admin/permisos", icon: KeyRound, permission: "MODULE_PERMISOS" },
  { title: "Auditoría", href: "/app/admin/auditoria", icon: ClipboardList, permission: "MODULE_AUDITORIA" },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const { logout } = useAuth();

  useEffect(() => {
    defaultApiAuth.getProfile().then((response: any) => {
      if (response) {
          console.log("User profile info: " + response.userId + " -> " + response.name);
          setProfile(response);
        } else {
          console.warn("No user data in profile response");
          logout();
        }
      });
  }, []);

  const agentMenuItemsFiltered = agentMenuItems.filter(item => profile?.permissions.includes(item.permission));
  const adminMenuItemsFiltered = adminMenuItems.filter(item => profile?.permissions.includes(item.permission));
  const adminMenu = profile?.permissions.includes("ADMIN") || profile?.permissions.includes("AUDIT");

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/app">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <CastleIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-serif font-semibold">
                    Travel & Repeat
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    Panel de Control
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        {/* Agent Modules */}
        <SidebarGroup>
          <SidebarGroupLabel>Módulos</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {agentMenuItemsFiltered.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      item.href === "/app"
                        ? pathname === "/app"
                        : pathname.startsWith(item.href)
                    }
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />
        {/* Admin Modules */}

        {adminMenu && (
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroup>
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger className="flex w-full items-center">
                  Administración
                  <ChevronDown className="ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {adminMenuItemsFiltered.map((item) => (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          asChild
                          isActive={pathname.startsWith(item.href)}
                          tooltip={item.title}
                        >
                          <Link href={item.href}>
                            <item.icon />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Volver al sitio">
              <Link href="/" className="text-muted-foreground">
                <CastleIcon />
                <span>Volver al sitio</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
