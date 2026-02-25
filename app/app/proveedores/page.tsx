"use client"

import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, Search, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { Provider, ProviderCategory } from "../lib/types"
import { apiClient } from "../api/apiClient"
import { useAuth } from "../auth/AuthContext"

const providerActionDelete = "PROVIDER_DELETE";
const providerActionUpdate = "PROVIDER_UPDATE";
const providerActionCreate = "PROVIDER_CREATE";

const categories: ProviderCategory[] = [
  "Aerolíneas", "Hoteles", "Tour Operadores", "Seguros", "Cruceros", "Renta de Autos", "Parques Temáticos", "Otro",
]

const categoryColors: Record<ProviderCategory, string> = {
  "Aerolíneas": "bg-blue-100 text-blue-800",
  "Hoteles": "bg-purple-100 text-purple-800",
  "Tour Operadores": "bg-green-100 text-green-800",
  "Seguros": "bg-yellow-100 text-yellow-800",
  "Cruceros": "bg-cyan-100 text-cyan-800",
  "Renta de Autos": "bg-orange-100 text-orange-800",
  "Parques Temáticos": "bg-pink-100 text-pink-800",
  "Otro": "bg-gray-100 text-gray-800",
}

export default function ProveedoresPage() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [search, setSearch] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null)
  const { user } = useAuth();

  const hasPermissionDelete = user?.permissions.includes(providerActionDelete);
  const hasPermissionUpdate = user?.permissions.includes(providerActionUpdate);
  const hasPermissionCreate = user?.permissions.includes(providerActionCreate);

  const [formData, setFormData] = useState({
    name: "", contact_name: "", email: "", phone: "", category: "Otro" as ProviderCategory, website: "", notes: "",
  })

  const filtered = providers.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.contact_name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase())
    const matchCategory = filterCategory === "all" || p.category === filterCategory
    return matchSearch && matchCategory
  })

  const openCreate = () => {
    setEditingProvider(null)
    setFormData({ name: "", contact_name: "", email: "", phone: "", category: "Otro", website: "", notes: "" })
    setDialogOpen(true)
  }

  const openEdit = (provider: Provider) => {
    setEditingProvider(provider)
    setFormData({
      name: provider.name,
      contact_name: provider.contact_name,
      email: provider.email,
      phone: provider.phone,
      category: provider.category,
      website: provider.website || "",
      notes: provider.notes || "",
    })
    setDialogOpen(true)
  }

  const handleSave = () => {
    if (editingProvider) {

      apiClient.put<Provider>("/providers/provider", {
        ...formData, 
        id: editingProvider.id,
      }).then((response) => {
        if (response.data) {
          console.log("Provider updated");
      
          setProviders((prev) => prev.map((p) => p.id === editingProvider.id
            ? { ...p, ...formData }
            : p))
                          
        } else {
          console.error("Failed to update provider");
        }
      }).catch((error) => {
        console.error("Error updating provider: \n", error.response.data);
      });

    } else {
      
      apiClient.post<Provider>("/providers/provider", {
        ...formData,
        created_by: user?.userId,
      }).then((response) => {
        if (response.data) {
          console.log("Provider saved");
          setProviders((prev) => [...prev, response.data])
        } else {
          console.error("Failed to create provider");
        }
      }).catch((error) => {
        console.error("Error creating provider: \n", error.response.data);
      });

    }
    setDialogOpen(false)
  }

  const handleDelete = (id: string) => {

    apiClient.delete<Provider>("/providers/provider?providerId=" + id).then((response) => {
      if (response.data) {
        console.log("Provider deleted");
        setProviders((prev) => prev.filter((p) => p.id !== id))
        } else {
          console.error("Failed to delete provider");
        }
      }).catch((error) => {
        console.error("Error deleting provider: ", error.message);
      });
      
  }

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        console.log("Providers loaded");
        const response = await apiClient.get<Provider[]>("/providers/providerList");
        setProviders(response.data);
      } catch (err: any) {
        console.error("Failed to load providers");
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Proveedores
          </h1>
          <p className="text-sm text-muted-foreground">
            Gestiona tu catálogo de proveedores
          </p>
        </div>
        {hasPermissionCreate && (
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Proveedor
          </Button>
        )}
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg">
              Total: {filtered.length} proveedores
            </CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9"/>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Web</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((provider) => (
                  <TableRow key={provider.id}>
                    <TableCell className="font-medium">
                      {provider.name}
                    </TableCell>
                    <TableCell>{provider.contact_name}</TableCell>
                    <TableCell>{provider.email}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryColors[provider.category]}`}>
                        {provider.category}
                      </span>
                    </TableCell>
                    <TableCell>
                      {provider.website && (
                        <a href={provider.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">

                        {hasPermissionUpdate && (
                          <Button variant="ghost" size="icon" onClick={() => openEdit(provider)} title="Editar">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                        

                        {hasPermissionDelete && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" title="Eliminar">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Eliminar proveedor</AlertDialogTitle>
                                <AlertDialogDescription>
                                  ¿Estás seguro de eliminar a {provider.name}?
                                  Esta acción no se puede deshacer.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(provider.id)}>
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}

                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No se encontraron proveedores.
                    </TableCell>
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
            <DialogTitle className="font-serif">
              {editingProvider ? "Editar Proveedor" : "Nuevo Proveedor"}
            </DialogTitle>
            <DialogDescription>
              {editingProvider
                ? "Modifica los datos del proveedor."
                : "Ingresa los datos del nuevo proveedor."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre empresa *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contact_name">Nombre contacto *</Label>
                <Input
                  id="contact_name"
                  value={formData.contact_name}
                  onChange={(e) =>
                    setFormData({ ...formData, contact_name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoría *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(val) =>
                    setFormData({
                      ...formData,
                      category: val as ProviderCategory,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Sitio web</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
                placeholder="https://"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notas</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                disabled={
                  !formData.name || !formData.contact_name || !formData.email
                }
              >
                {editingProvider ? "Guardar Cambios" : "Crear Proveedor"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
