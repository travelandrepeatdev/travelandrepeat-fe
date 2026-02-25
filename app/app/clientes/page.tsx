"use client"

import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import type { Client } from "../lib/types"
import { apiClient } from "../api/apiClient"
import { useAuth } from "../auth/AuthContext"

const clientActionDelete = "CLIENT_DELETE";
const clientActionUpdate = "CLIENT_UPDATE";
const clientActionCreate = "CLIENT_CREATE";

export default function ClientesPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [search, setSearch] = useState("")
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", country_code: "MX", address: "", notes: "" })

  const { user } = useAuth();
  const hasPermissionDelete = user?.permissions.includes(clientActionDelete);
  const hasPermissionUpdate = user?.permissions.includes(clientActionUpdate);
  const hasPermissionCreate = user?.permissions.includes(clientActionCreate);

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  )

  const openCreate = () => {
    setEditingClient(null)
    setFormData({ name: "", email: "", phone: "", country_code: "MX", address: "", notes: "" })
    setDialogOpen(true)
  }

  const openEdit = (client: Client) => {
    setEditingClient(client)
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      country_code: client.country_code,
      address: client.address,
      notes: client.notes || "",
    })
    setDialogOpen(true)
  }

  const handleSave = () => {
    if (editingClient) {
      
      apiClient.put<Client>("/clients/client", {
        ...formData, 
        id: editingClient.id,
      }).then((response) => {
        if (response.data) {
          console.log("Client updated");
              
          setClients((prev) =>
            prev.map((c) => c.id === editingClient.id
              ? { ...c, ...formData }
              : c
          ));
        } else {
          console.error("Failed to update client");
        }
      }).catch((error) => {
        console.error("Error updating client: \n", error.response.data);
      });

    } else {

      apiClient.post<Client>("/clients/client", {
        ...formData,
        created_by: user?.userId,
      }).then((response) => {
        if (response.data) {
          console.log("Client saved");
          setClients((prev) => [...prev, response.data]);
        } else {
          console.error("Failed to create client");
        }
      }).catch((error) => {
        console.error("Error creating client: \n", error.response.data);
      });
      
    }

    setDialogOpen(false)
  }

  const handleDelete = (id: string) => {

    apiClient.delete<Client>("/clients/client?clientId=" + id).then((response) => {
      if (response.data) {
        console.log("Client deleted");
        setClients((prev) => prev.filter((c) => c.id !== id))
        } else {
          console.error("Failed to delete client");
        }
      }).catch((error) => {
        console.error("Error deleting client: ", error.message);
      });
  }

  useEffect(() => {
    const fetchClients = async () => {
      try {
        console.log("Clients loaded");
        const response = await apiClient.get<Client[]>("/clients/clientList");
        setClients(response.data);
      } catch (err: any) {
        console.error("Failed to load clients");
      }
    };

    fetchClients();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Clientes
          </h1>
          <p className="text-sm text-muted-foreground">
            Gestiona tu catálogo de clientes
          </p>
        </div>
        {hasPermissionCreate && (
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Cliente
          </Button>
        )}
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg">
              Total: {filtered.length} clientes
            </CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Buscar por nombre, email o teléfono..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9"/>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>País</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.phone}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{client.country_code}</Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {client.address}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        
                        {hasPermissionUpdate && (
                          <Button variant="ghost" size="icon" onClick={() => openEdit(client)} title="Editar">
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
                                <AlertDialogTitle>
                                  Eliminar cliente
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  ¿Estás seguro de eliminar a {client.name}?
                                  Esta acción no se puede deshacer.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(client.id)}>
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
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      No se encontraron clientes.
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
              {editingClient ? "Editar Cliente" : "Nuevo Cliente"}
            </DialogTitle>
            <DialogDescription>
              {editingClient
                ? "Modifica los datos del cliente."
                : "Ingresa los datos del nuevo cliente."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo *</Label>
              <Input id="name" value={formData.name} onChange={(e) => 
                setFormData({ ...formData, name: e.target.value })
                } required/>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono *</Label>
                <Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required/>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="country_code">País</Label>
                <Input id="country_code" value={formData.country_code} onChange={(e) => setFormData({ ...formData, country_code: e.target.value })}/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Input id="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })}/>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notas</Label>
              <Textarea id="notes" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3}/>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={!formData.name || !formData.email || !formData.phone}>
                {editingClient ? "Guardar Cambios" : "Crear Cliente"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}