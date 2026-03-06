"use client"

import { useEffect, useState } from "react"
import { Plus, Pencil, Search, UserX, UserCheck, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { Permission, Role, RolePermission, User, UserRole } from "../../lib/types"
import { apiClient } from "../../api/apiClient"
import { AxiosResponse } from "axios"

export default function UsuariosPage() {
  const [newUser, setNewUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [userRoles, setUserRoles] = useState<UserRole[]>([])
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({ email: "", display_name: "", role_id: ""})

  const filtered = users.filter((u) =>
    (u.display_name || "").toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const getUserRole = (userId: string) => {
    const ur = userRoles.find((ur) => ur.user_id === userId)
    if (!ur) return null
    return roles.find((r) => r.role_id === ur.role_id) || null
  }

  const getUserPermissions = (userId: string) => {
    const ur = userRoles.find((ur) => ur.user_id === userId)
    if (!ur) return []
    const rps = rolePermissions.filter((rp) => rp.role_id === ur.role_id)
    return rps.map((rp) => permissions.find((p) => p.permission_id === rp.permission_id)).filter(Boolean)
  }

  const openCreate = () => {
    setEditingUser(null)
    setFormData({ email: "", display_name: "", role_id: "" })
    setDialogOpen(true)
  }

  const openEdit = (user: User) => {
    setEditingUser(user)
    const role = getUserRole(user.user_id)
    setFormData({
      email: user.email,
      display_name: user.display_name || "",
      role_id: role?.role_id || "",
    })
    setDialogOpen(true)
  }

  const openPermissions = (user: User) => {
    setSelectedUser(user)
    setPermissionsDialogOpen(true)
  }

  const handleSave = () => {
    if (editingUser) {
      const newUser: User = {
        user_id: editingUser.user_id,
        email: formData.email,
        is_active: true,
        last_login: null,
        display_name: formData.display_name,
        avatar_url: null,
        created_at: null,
        updated_at: null,
        role: editingUser.role
      }
      saveUpdateUser(newUser, false);
    } else {
      const newUser: User = {
        user_id: "",
        email: formData.email,
        is_active: true,
        last_login: null,
        display_name: formData.display_name,
        avatar_url: null,
        created_at: null,
        updated_at: null,
        role: ""
      }
      saveUpdateUser(newUser, true);
    }
    setDialogOpen(false)
  }

  const saveUpdateUser = async (newUser: User, isNew: boolean) => {
    let responseUser: AxiosResponse;
    try {
      if (isNew) {
        responseUser = await apiClient.post("/users/user", newUser);
        console.log("User saved");
        setUsers((prev) => [...prev, responseUser.data]);
      } else {
        responseUser = await apiClient.put("/users/user", newUser);
        console.log("User updated");
        setUsers((prev) =>
          prev.map((u) =>
            u.user_id === editingUser?.user_id
              ? {
                  ...u,
                  email: responseUser.data.email,
                  display_name: responseUser.data.display_name,
                  role: responseUser.data.role,
                  last_login: responseUser.data.last_login,
                }
              : u,
          ),
        );
      }
      newUser = responseUser.data;
    } catch (err: any) {
      console.error("Failed on user operation");
    }

    if (formData.role_id) {
      try {
        if (isNew) {
          responseUser = await apiClient.post("/users/userRole", {
            user_id: newUser.user_id,
            role_id: formData.role_id,
          });
          console.log("User - Role saved");
          setUserRoles((prev) => [...prev, responseUser.data]);
        } else {
          responseUser = await apiClient.put("/users/userRole", {
            user_id: newUser.user_id,
            role_id: formData.role_id,
          });
          console.log("User - Role updated");
          setUserRoles((prev) => {
            const without = prev.filter((ur) => ur.user_id !== editingUser?.user_id)
            return [...without, 
              { 
                user_id: responseUser.data.user_id, 
                role_id: responseUser.data.role_id,
                assigned_at: responseUser.data.assigned_at 
              }]
          })
        }
        
      } catch (err: any) {
        console.error("Failed on user - role operation");
      }
    }
  };

  const toggleActive = (userId: string) => {

    apiClient.put("/users/userEnableDisable?userId=" + userId).then((response) => {
          if (response.data) {
            console.log("User enabled: " + response.data.is_active);
            setUsers((prev) =>
              prev.map((u) =>
                u.user_id === userId
                  ? { ...u, is_active: response.data.is_active }
                  : u
              ));
          } else {
            console.error("Failed to create role");
          }
        }).catch((error) => {
          console.error("Error creating role: \n", error.response.data);
        });
  }

  const formatDate = (date: string | null) => {
    if (!date) return "Nunca"
    return new Date(date).toLocaleDateString("es-MX", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
  }

  useEffect(() => { 
      const fetchUsers = async () => {
        try {
          console.log("Users loaded");
          const response = await apiClient.get<User[]>("/users/userList");
          setUsers(response.data);
        } catch (err: any) {
          console.error("Failed to load users");
        }
      };
      fetchUsers();
    }, []);

  useEffect(() => { 
      const fetchRoles = async () => {
        try {
          console.log("Roles loaded");
          const response = await apiClient.get<Role[]>("/roles/roleList");
          setRoles(response.data);
        } catch (err: any) {
          console.error("Failed to load roles");
        }
      };
      fetchRoles();
    }, []);

  useEffect(() => { 
        const fetchRolePermissions = async () => {
          try {
            console.log("Role - Permissions loaded");
            const response = await apiClient.get<RolePermission[]>("/roles/rolePermissionList");
            setRolePermissions(response.data);
          } catch (err: any) {
            console.error("Failed to load role - permissions");
          }
        };
        fetchRolePermissions();
      }, []);

  useEffect(() => { 
        const fetchPermissions = async () => {
          try {
            console.log("Permissions loaded");
            const response = await apiClient.get<Permission[]>("/permissions/permissionList");
            setPermissions(response.data);
          } catch (err: any) {
            console.error("Failed to load permissions");
          }
        };
        fetchPermissions();
      }, []);

  useEffect(() => { 
      const fetchUserRole = async () => {
        try {
          console.log("User - Role loaded");
          const response = await apiClient.get<UserRole[]>("/users/userRoleList");
          setUserRoles(response.data);
        } catch (err: any) {
          console.error("Failed to load user - role");
        }
      };
      fetchUserRole();
    }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Usuarios</h1>
          <p className="text-sm text-muted-foreground">Gestiona los usuarios del sistema y sus roles</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Usuario
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{users.length}</p>
              <p className="text-sm text-muted-foreground">Total Usuarios</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{users.filter((u) => u.is_active).length}</p>
              <p className="text-sm text-muted-foreground">Activos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-destructive">{users.filter((u) => !u.is_active).length}</p>
              <p className="text-sm text-muted-foreground">Inactivos</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg">Listado de Usuarios</CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Buscar por nombre o email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Ultimo acceso</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((user) => {
                  const role = getUserRole(user.user_id)
                  return (
                    <TableRow key={user.user_id}>
                      <TableCell className="font-medium">{user.display_name || "Sin nombre"}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {role ? (
                          <Badge variant={role.name === "admin" ? "default" : role.name === "agent" ? "secondary" : "outline"}>
                            {role.name}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">Sin rol</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.is_active ? "default" : "destructive"} className={user.is_active ? "bg-green-600 hover:bg-green-700" : ""}>
                          {user.is_active ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{formatDate(user.last_login)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openPermissions(user)} title="Ver permisos">
                            <Shield className="h-4 w-4 text-[#9473d4]" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openEdit(user)} title="Editar">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" title={user.is_active ? "Desactivar" : "Activar"}>
                                {user.is_active ? <UserX className="h-4 w-4 text-destructive" /> : <UserCheck className="h-4 w-4 text-green-600" />}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>{user.is_active ? "Desactivar" : "Activar"} usuario</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {user.is_active
                                    ? `¿Desactivar a ${user.display_name || user.email}? No podrá acceder al sistema.`
                                    : `¿Activar a ${user.display_name || user.email}? Podrá acceder nuevamente al sistema.`}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => toggleActive(user.user_id)}>
                                  {user.is_active ? "Desactivar" : "Activar"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">No se encontraron usuarios.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif">{editingUser ? "Editar Usuario" : "Nuevo Usuario"}</DialogTitle>
            <DialogDescription>{editingUser ? "Modifica los datos del usuario." : "Ingresa los datos del nuevo usuario."}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="display_name">Nombre *</Label>
              <Input id="display_name" value={formData.display_name} onChange={(e) => setFormData({ ...formData, display_name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Rol</Label>
              <Select value={formData.role_id} onValueChange={(v) => setFormData({ ...formData, role_id: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.role_id} value={role.role_id}>
                      {role.name} - {role.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSave} disabled={!formData.email || !formData.display_name}>{editingUser ? "Guardar Cambios" : "Crear Usuario"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Permissions Dialog */}
      <Dialog open={permissionsDialogOpen} onOpenChange={setPermissionsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif">Permisos de {selectedUser?.display_name || selectedUser?.email}</DialogTitle>
            <DialogDescription>Permisos efectivos derivados de su rol asignado.</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Rol:</span>
                <Badge>{getUserRole(selectedUser.user_id)?.name || "Sin rol"}</Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Permisos ({getUserPermissions(selectedUser.user_id).length})</p>
                <div className="grid gap-2">
                  {getUserPermissions(selectedUser.user_id).map((perm) => (
                    <div key={perm?.permission_id} className="flex items-center justify-between rounded-lg border border-border/50 p-3">
                      <div>
                        <p className="text-sm font-medium font-mono">{perm?.name}</p>
                        <p className="text-xs text-muted-foreground">{perm?.description}</p>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">Activo</Badge>
                    </div>
                  ))}
                  {getUserPermissions(selectedUser.user_id).length === 0 && (
                    <p className="py-4 text-center text-sm text-muted-foreground">Este usuario no tiene permisos asignados.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
