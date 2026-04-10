"use client"

import { Fragment, useEffect, useState } from "react"
import { Plus, Pencil, Trash2, Search, Grid3X3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Permission, Role, RolePermission } from "../../lib/types"
import { defaultApiAuth } from "../../lib/api"
import { useToast } from "@/hooks/use-toast"

export default function PermisosPage() {
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPerm, setEditingPerm] = useState<Permission | null>(null)
  const [formData, setFormData] = useState({ name: "", description: "" })
  const filtered = permissions.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.description || "").toLowerCase().includes(search.toLowerCase())
  )
  const { toast } = useToast();
  const getPermissionRoles = (permId: string) => {
    const roleIds = rolePermissions.filter((rp) => rp.permission_id === permId).map((rp) => rp.role_id)
    return roles.filter((r) => roleIds.includes(r.role_id))
  }

  // Group permissions by module
  const permissionGroups = permissions.reduce<Record<string, typeof permissions>>((acc, perm) => {
    const module = perm.name.split("_")[0]
    if (!acc[module]) acc[module] = []
    acc[module].push(perm)
    return acc
  }, {})

  const openCreate = () => {
    setEditingPerm(null)
    setFormData({ name: "", description: "" })
    setDialogOpen(true)
  }

  const openEdit = (perm: Permission) => {
    setEditingPerm(perm)
    setFormData({ name: perm.name, description: perm.description || "" })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (editingPerm) {

      try {
        const updatedPerm = await defaultApiAuth.putPermission({ permission_id: editingPerm.permission_id, name: formData.name, description: formData.description } as Permission);
        if (!updatedPerm) {
          console.warn("Permission not found -> " + editingPerm.permission_id);
          toast({ title: "Alerta", description: `El permiso [${formData.name}] no fue encontrado.`, variant: "warning" });
          return;
        }
        console.log("Permission updated -> ", updatedPerm.permission_id);
        setPermissions((prev) => prev.map((p) => p.permission_id === updatedPerm.permission_id ? updatedPerm : p));
        toast({ title: "Permiso actualizado", description: `El permiso [${updatedPerm.name}] fue actualizado correctamente.`, variant: "success" });
      } catch (error) {
        console.error("Error updating permission -> " + editingPerm.permission_id, error);
        toast({ title: "Error", description: `No se pudo actualizar el permiso [${formData.name}].`, variant: "destructive" });
      }

    } else {

      try {
        const newPerm = await defaultApiAuth.postPermission({ name: formData.name, description: formData.description } as Permission);
        if (!newPerm) {
          console.warn("Failed to create permission");
          toast({ title: "Alerta", description: `No se pudo crear el permiso [${formData.name}].`, variant: "warning" });
          return;
        }
        console.log("Permission created -> ", newPerm.permission_id);
        setPermissions((prev) => [...prev, newPerm])
        toast({ title: "Permiso creado", description: `El permiso [${newPerm.name}] fue creado correctamente.`, variant: "success" });
      } catch (error) {
        console.error("Error creating permission", error);
        toast({ title: "Error", description: `No se pudo crear el permiso [${formData.name}].`, variant: "destructive" });
      }

    }
    setDialogOpen(false)
  }

  const handleDelete = async (id: string) => {
    try {
      const responseId = await defaultApiAuth.deletePermission(id);
      if (!responseId) {
        console.warn("Permission not found -> " + id);
        toast({ title: "Alerta", description: `El permiso [${id}] no fue encontrado.`, variant: "warning" });
        return;
      }
      console.log("Permission deleted -> ", responseId);
      setPermissions((prev) => prev.filter((p) => p.permission_id !== responseId));
      toast({ title: "Permiso eliminado", description: `El permiso [${responseId}] fue eliminado correctamente.`, variant: "success" });
    } catch (error) {
      console.error("Error deleting permission -> " + id, error);
      toast({ title: "Error", description: `No se pudo eliminar el permiso [${id}].`, variant: "destructive" });
    }
  }

  useEffect(() => {
    const fetchPermissions = async () => {
      const response = await defaultApiAuth.getPermissions();
      console.log("Permissions fetched -> ", response.length);
      setPermissions(response);
      toast({ title: "Permisos cargados", description: `Se cargaron ${response.length} permisos.`, variant: "success" });
    };
    fetchPermissions();
  }, []);

  useEffect(() => {
    const fetchRolePermissions = async () => {
      const response = await defaultApiAuth.getRolePermissions();
      console.log("Role-Permissions fetched -> ", response.length);
      setRolePermissions(response);
    };
    fetchRolePermissions();
  }, []);

  useEffect(() => {
    const fetchRoles = async () => {
      const response = await defaultApiAuth.getRoles();
      console.log("Roles fetched -> ", response.length);
      setRoles(response);
    };
    fetchRoles();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Permisos</h1>
          <p className="text-sm text-muted-foreground">Gestiona los permisos granulares del sistema</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Permiso
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{permissions.length}</p>
              <p className="text-sm text-muted-foreground">Total Permisos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#9473d4]">{Object.keys(permissionGroups).length}</p>
              <p className="text-sm text-muted-foreground">Modulos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{roles.length}</p>
              <p className="text-sm text-muted-foreground">Roles Configurados</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="table">
        <TabsList>
          <TabsTrigger value="table">Listado</TabsTrigger>
          <TabsTrigger value="matrix" className="gap-2">
            <Grid3X3 className="h-4 w-4" />
            Matriz
          </TabsTrigger>
        </TabsList>

        {/* Table View */}
        <TabsContent value="table">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="text-lg">Listado de Permisos</CardTitle>
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Buscar permiso..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Permiso</TableHead>
                      <TableHead>Descripcion</TableHead>
                      <TableHead>Modulo</TableHead>
                      <TableHead>Roles que lo usan</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((perm) => {
                      const roles = getPermissionRoles(perm.permission_id)
                      return (
                        <TableRow key={perm.permission_id}>
                          <TableCell className="font-mono text-sm font-medium">{perm.name}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{perm.description || "-"}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">{perm.name.split("_")[0]}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {roles.map((role) => (
                                <Badge key={role.role_id} variant="secondary" className="text-xs">{role.name}</Badge>
                              ))}
                              {roles.length === 0 && <span className="text-xs text-muted-foreground">Sin asignar</span>}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" onClick={() => openEdit(perm)} title="Editar">
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
                                    <AlertDialogTitle>Eliminar permiso</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      ¿Eliminar &quot;{perm.name}&quot;? Se eliminará de todos los roles asignados.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(perm.permission_id)}>Eliminar</AlertDialogAction>
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
                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">No se encontraron permisos.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Matrix View */}
        <TabsContent value="matrix">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Matriz de Permisos por Rol</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[200px]">Permiso</TableHead>
                      {roles.map((role) => (
                        <TableHead key={role.role_id} className="text-center min-w-[100px]">
                          <Badge variant={role.name === "admin" ? "default" : role.name === "agent" ? "secondary" : "outline"}>
                            {role.name}
                          </Badge>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(permissionGroups).map(([module, perms]) => (
                      <Fragment key={module}>
                        <TableRow key={`header-${module}`} className="bg-muted/50">
                          <TableCell colSpan={roles.length + 1} className="font-medium capitalize text-foreground">
                            {module}
                          </TableCell>
                        </TableRow>
                        {perms.map((perm) => (
                          <TableRow key={perm.permission_id}>
                            <TableCell className="font-mono text-sm">{perm.name}</TableCell>
                            {roles.map((role) => {
                              const hasPermission = rolePermissions.some(
                                (rp) => rp.role_id === role.role_id && rp.permission_id === perm.permission_id
                              )
                              return (
                                <TableCell key={role.role_id} className="text-center">
                                  {hasPermission ? (
                                    <span className="inline-block h-4 w-4 rounded-full bg-green-500" title="Permitido" />
                                  ) : (
                                    <span className="inline-block h-4 w-4 rounded-full bg-muted-foreground/20" title="No asignado" />
                                  )}
                                </TableCell>
                              )
                            })}
                          </TableRow>
                        ))}
                      </Fragment>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif">{editingPerm ? "Editar Permiso" : "Nuevo Permiso"}</DialogTitle>
            <DialogDescription>{editingPerm ? "Modifica el permiso." : "Crea un nuevo permiso granular."}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del permiso *</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="ej. reports.read, settings.write" />
              <p className="text-xs text-muted-foreground">Formato: modulo.accion (ej. clients.read, invoices.write)</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descripcion</Label>
              <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} placeholder="Describe lo que permite este permiso..." />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSave} disabled={!formData.name}>{editingPerm ? "Guardar Cambios" : "Crear Permiso"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
