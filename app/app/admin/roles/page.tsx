"use client"

import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, Search, Users, KeyRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import type { Permission, Role, RolePermission, User, UserRole } from "../../lib/types"
import { apiClient } from "../../api/apiClient"
import { useAuth } from "../../auth/AuthContext"

export default function RolesPage() {
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [userRoles, setUserRoles] = useState<UserRole[]>([])
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([])
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [permDialogOpen, setPermDialogOpen] = useState(false)
  const [usersDialogOpen, setUsersDialogOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [selectedPermIds, setSelectedPermIds] = useState<string[]>([])
  const { user } = useAuth()
  const [formData, setFormData] = useState({ name: "", description: "" })

  const filtered = roles.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    (r.description || "").toLowerCase().includes(search.toLowerCase())
  )

  const getRolePermissionCount = (roleId: string) =>
    rolePermissions.filter((rp) => rp.role_id === roleId).length

  const getRoleUserCount = (roleId: string) =>
    userRoles.filter((ur) => ur.role_id === roleId).length

  const getRoleUsers = (roleId: string) => {
    const userIds = userRoles.filter((ur) => ur.role_id === roleId).map((ur) => ur.user_id)
    return users.filter((u) => userIds.includes(u.user_id))
  }

  const openCreate = () => {
    setEditingRole(null)
    setFormData({ name: "", description: "" })
    setDialogOpen(true)
  }

  const openEdit = (role: Role) => {
    setEditingRole(role)
    setFormData({ name: role.name, description: role.description || "" })
    setDialogOpen(true)
  }

  const openPermissions = (role: Role) => {
    setSelectedRole(role)
    const currentPermIds = rolePermissions
      .filter((rp) => rp.role_id === role.role_id)
      .map((rp) => rp.permission_id)
    setSelectedPermIds(currentPermIds)
    setPermDialogOpen(true)
  }

  const openUsers = (role: Role) => {
    setSelectedRole(role)
    setUsersDialogOpen(true)
  }

  const handleSave = () => {
    if (editingRole) {

      apiClient.put("/roles/role", {
        role_id: editingRole.role_id,
        name: formData.name,
        description: formData.description
      }).then((response) => {
        if (response.data) {
          console.log("Role updated");
          
          setRoles((prev) =>
            prev.map((r) =>
              r.role_id === response.data.role_id
                ? { ...r, name: formData.name, description: formData.description }
                : r
            ));
          
        } else {
          console.error("Failed to update role");
        }
      }).catch((error) => {
        console.error("Error updating role: \n", error.response.data);
      });
      
    } else {

      apiClient.post("/roles/role", {
        role_id: null,
        name: formData.name,
        description: formData.description
      }).then((response) => {
          if (response.data) {
            console.log("Role saved");
            setRoles((prev) => [...prev, response.data])
          } else {
            console.error("Failed to create role");
          }
        }).catch((error) => {
          console.error("Error creating role: \n", error.response.data);
        });

    }
    setDialogOpen(false)
  }

  const handleDelete = (id: string) => {

    apiClient.delete("/roles/role?roleId=" + id).then((response) => {
          if (response.data) {
            console.log("Role deleted");
            setRoles((prev) => prev.filter((r) => r.role_id !== id))
            setRolePermissions((prev) => prev.filter((rp) => rp.role_id !== id))
          } else {
            console.error("Failed to delete role");
          }
        }).catch((error) => {
          console.error("Error deleting role: \n", error.response.data);
        });

  }

  const handleSavePermissions = () => {
    const withoutCurrent = rolePermissions.filter((rp) => rp.role_id !== selectedRole?.role_id)
    const newMappings = selectedPermIds.map((pid) => ({ role_id: selectedRole?.role_id, permission_id: pid }))
    
    apiClient.put("/roles/rolePermissionList", newMappings.length == 0 ? [{role_id: selectedRole?.role_id}] : newMappings).then((response) => {
          if (response.data) {
            console.log("Role - Permissions saved");
            setRolePermissions([...withoutCurrent, ...response.data])
          } else {
            console.error("Failed to save role - permission");
          }
        }).catch((error) => {
          console.error("Error saving role - permission: \n", error.response.data);
        });

    setPermDialogOpen(false)
  }

  const togglePermission = (permId: string) => {
    setSelectedPermIds((prev) =>
      prev.includes(permId) ? prev.filter((id) => id !== permId) : [...prev, permId]
    )
  }

  // Group permissions by module
  const permissionGroups = permissions.reduce<Record<string, typeof permissions>>((acc, perm) => {
    const module = perm.name.split("_")[0]
    if (!acc[module]) acc[module] = []
    acc[module].push(perm)
    return acc
  }, {})

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Roles</h1>
          <p className="text-sm text-muted-foreground">Gestiona los roles del sistema y sus permisos asignados</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Rol
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{roles.length}</p>
              <p className="text-sm text-muted-foreground">Total Roles</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#9473d4]">{permissions.length}</p>
              <p className="text-sm text-muted-foreground">Total Permisos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{userRoles.length}</p>
              <p className="text-sm text-muted-foreground">Asignaciones</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg">Listado de Roles</CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Buscar rol..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripcion</TableHead>
                  <TableHead>Permisos</TableHead>
                  <TableHead>Usuarios</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((role) => (
                  <TableRow key={role.role_id}>
                    <TableCell>
                      <Badge variant={role.name === "admin" ? "default" : role.name === "agent" ? "secondary" : "outline"}>
                        {role.name}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{role.description || "-"}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="gap-1 text-[#9473d4]" onClick={() => openPermissions(role)}>
                        <KeyRound className="h-3 w-3" />
                        {getRolePermissionCount(role.role_id)}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="gap-1 text-primary" onClick={() => openUsers(role)}>
                        <Users className="h-3 w-3" />
                        {getRoleUserCount(role.role_id)}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(role)} title="Editar">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" title="Eliminar">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Eliminar rol</AlertDialogTitle>
                              <AlertDialogDescription>
                                ¿Eliminar el rol &quot;{role.name}&quot;? Los usuarios asignados perderán estos permisos.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(role.role_id)}>Eliminar</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">No se encontraron roles.</TableCell>
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
            <DialogTitle className="font-serif">{editingRole ? "Editar Rol" : "Nuevo Rol"}</DialogTitle>
            <DialogDescription>{editingRole ? "Modifica los datos del rol." : "Crea un nuevo rol para el sistema."}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del rol *</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="ej. editor, manager" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descripcion</Label>
              <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} placeholder="Describe las responsabilidades de este rol..." />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSave} disabled={!formData.name}>{editingRole ? "Guardar Cambios" : "Crear Rol"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Permissions Assignment Dialog */}
      <Dialog open={permDialogOpen} onOpenChange={setPermDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif">Permisos del rol: {selectedRole?.name}</DialogTitle>
            <DialogDescription>Selecciona los permisos que deseas asignar a este rol.</DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {Object.entries(permissionGroups).map(([module, perms]) => (
              <div key={module} className="space-y-3">
                <h3 className="font-medium capitalize text-foreground border-b border-border/50 pb-1">{module}</h3>
                <div className="grid gap-2">
                  {perms.map((perm) => (
                    <label key={perm.permission_id} className="flex items-center gap-3 rounded-lg border border-border/50 p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                      <Checkbox
                        checked={selectedPermIds.includes(perm.permission_id)}
                        onCheckedChange={() => togglePermission(perm.permission_id)}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium font-mono">{perm.name}</p>
                        <p className="text-xs text-muted-foreground">{perm.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <div className="flex justify-end gap-2 border-t border-border/50 pt-4">
              <Button variant="outline" onClick={() => setPermDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSavePermissions}>Guardar Permisos ({selectedPermIds.length})</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Users in Role Dialog */}
      <Dialog open={usersDialogOpen} onOpenChange={setUsersDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif">Usuarios con rol: {selectedRole?.name}</DialogTitle>
            <DialogDescription>Usuarios que tienen asignado este rol.</DialogDescription>
          </DialogHeader>
          {selectedRole && (
            <div className="space-y-2">
              {getRoleUsers(selectedRole.role_id).map((user) => (
                <div key={user.user_id} className="flex items-center justify-between rounded-lg border border-border/50 p-3">
                  <div>
                    <p className="text-sm font-medium">{user.display_name || "Sin nombre"}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <Badge variant={user.is_active ? "default" : "destructive"} className={user.is_active ? "bg-green-600" : ""}>
                    {user.is_active ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
              ))}
              {getRoleUsers(selectedRole.role_id).length === 0 && (
                <p className="py-4 text-center text-sm text-muted-foreground">No hay usuarios con este rol.</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
