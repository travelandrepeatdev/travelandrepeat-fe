"use client"

import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, Search, LayoutGrid, TableIcon, ToggleLeft, ToggleRight } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { Promotion, Currency } from "../lib/types"
import { useAuth } from "../auth/AuthContext"
import { apiClient } from "../api/apiClient"

const promotionActionDelete = "PROMOTION_DELETE";
const promotionActionUpdate = "PROMOTION_UPDATE";
const promotionActionCreate = "PROMOTION_CREATE";
const promotionActionEnableDisable = "PROMOTION_ENABLE_DISABLE";

const formatedDate = (date: string) => {
  const result = date ? date.slice(0, 10) : "";
  return result;
}

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function PromocionesPage() {
  const [file, setFile] = useState<File | null>(null)
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [search, setSearch] = useState("")
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null)
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "", description: "", destination: "", original_price: 0, promo_price: 0,
    currency: "USD" as Currency, start_date: "", end_date: "", is_active: true, created_by: "",
    image_url: ""
  })

  const hasPermissionDelete = user?.permissions.includes(promotionActionDelete);
  const hasPermissionUpdate = user?.permissions.includes(promotionActionUpdate);
  const hasPermissionCreate = user?.permissions.includes(promotionActionCreate);
  const hasPermissionEnableDisable = user?.permissions.includes(promotionActionEnableDisable);

  const filtered = promotions.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.destination.toLowerCase().includes(search.toLowerCase())
  )

  const openCreate = () => {
    setEditingPromo(null)
    setFile(null)
    setFormData({ 
      title: "", description: "", destination: "", original_price: 0, promo_price: 0, 
      currency: "USD", start_date: "", end_date: "", is_active: true, created_by: "",
      image_url: ""
    })
    setDialogOpen(true)
  }

  const openEdit = (promo: Promotion) => {
    setEditingPromo(promo)
    setFile(null)
    setFormData({
      title: promo.title, description: promo.description, destination: promo.destination,
      original_price: promo.original_price, promo_price: promo.promo_price, currency: promo.currency, 
      start_date: formatedDate(promo.start_date), end_date: formatedDate(promo.end_date), is_active: promo.is_active,
      created_by: "", image_url: promo.image_url || ""
    })
    setDialogOpen(true)
  }

  const handleSave = () => {

    const form = new FormData()
    form.append("image", !file ? "" : file)

    if (editingPromo) {

      const obj = {
        ...formData,
        id: editingPromo.id
      };

      form.append("promotionRequest",
      new Blob(
        [JSON.stringify(obj)],
        { type: "application/json" }
      ))

      apiClient.put("/promotions/promotion", form).then((response) => {
        if (response.data) {
          console.log("Promotion updated");
          setPromotions((prev) => prev.map((p) => p.id === editingPromo.id ? { ...p, ...response.data } : p))
        } else {
          console.error("Failed to update promotion");
        }
      }).catch((error) => {
        console.error("Error updating promotion: \n", error.response.data);
      });

    } else {

      const obj = {
        ...formData,
        created_by: user?.userId,
      };

      form.append("promotionRequest",
      new Blob(
        [JSON.stringify(obj)],
        { type: "application/json" }
      ))

      apiClient.post("/promotions/promotion", form).then((response) => {
          if (response.data) {
            console.log("Promotion saved");
            setPromotions((prev) => [...prev, response.data])
          } else {
            console.error("Failed to create blog");
          }
        }).catch((error) => {
          console.error("Error creating blog: \n", error.response.data);
        });

    }
    setDialogOpen(false)
  }

  const toggleActive = (id: string) => {

    apiClient.put<Promotion>("/promotions/promotionEnableDisable?promotionId=" + id).then((response) => {
        if (response.data) {
          console.log("Promotion active: " + response.data.is_active);
          setPromotions((prev) => prev.map((p) => p.id === id ? 
          { ...p, is_active: !p.is_active } 
          : p))
        } else {
          console.error("Failed to enable/disable promotion");
        }
      }).catch((error) => {
        console.error("Error enable/disable promotion: \n", error.response.data);
      });

  }

  const handleDelete = (id: string) => {

    apiClient.delete<Promotion>("/promotions/promotion?promotionId=" + id).then((response) => {
      if (response.data) {
        console.log("Promotion deleted");
        setPromotions((prev) => prev.filter((p) => p.id !== id))
        } else {
          console.error("Failed to delete promotion");
        }
      }).catch((error) => {
        console.error("Error deleting promotion: \n", error.message);
      }
    );
 
  }

  const discount = (orig: number, promo: number) =>
    orig > 0 ? Math.round(((orig - promo) / orig) * 100) : 0

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0])
    }
  };

  useEffect(() => { 
    const fetchPromotions = async () => {
      try {
        console.log("Promotions loaded");
        const response = await apiClient.get<Promotion[]>("/promotions/promotionList");
        setPromotions(response.data);
      } catch (err: any) {
        console.error("Failed to load promotions");
      }
    };
    fetchPromotions();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Promociones
          </h1>
          <p className="text-sm text-muted-foreground">
            Gestiona las promociones y ofertas de viajes
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-lg border border-border">
            <Button
              variant={viewMode === "cards" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("cards")}
              className="rounded-r-none"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("table")}
              className="rounded-l-none"
            >
              <TableIcon className="h-4 w-4" />
            </Button>
          </div>

          {hasPermissionCreate && (
            <Button onClick={openCreate} className="gap-2">
              <Plus className="h-4 w-4" />
              Nueva Promoción
            </Button>
          )}
        </div>
      </div>

      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar promociones..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Card View */}
      {viewMode === "cards" ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {filtered.map((promo) => (
            <Card key={promo.id} className="overflow-hidden">
              
              {promo.image_url && (
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    src={apiBaseUrl + promo.image_url}
                    alt={promo.title}
                    fill
                    className="object-cover"
                  />
                  {!promo.is_active && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <Badge variant="secondary" className="text-sm">
                        Inactiva
                      </Badge>
                    </div>
                  )}
                </div>
              )}
              
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-serif">
                    {promo.title}
                  </CardTitle>
                  <Badge variant={promo.is_active ? "default" : "secondary"}>
                    {promo.is_active ? "Activa" : "Inactiva"}
                  </Badge>
                </div>
                <CardDescription>{promo.destination}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {promo.description}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-primary">
                    ${promo.promo_price.toLocaleString()} {promo.currency}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    ${promo.original_price.toLocaleString()}
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800"
                  >
                    -{discount(promo.original_price, promo.promo_price)}%
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {promo.start_date} - {promo.end_date}
                </p>
                <div className="flex gap-1">
                  {hasPermissionEnableDisable && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleActive(promo.id)}
                      title={promo.is_active ? "Desactivar" : "Activar"}
                    >
                      {promo.is_active ? (
                        <ToggleRight className="h-4 w-4 text-green-600" />
                      ) : (
                        <ToggleLeft className="h-4 w-4" />
                      )}
                    </Button>
                  )}

                  {hasPermissionUpdate && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEdit(promo)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}

                  {hasPermissionDelete && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Eliminar promoción
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            ¿Estás seguro de eliminar "{promo.title}"?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(promo.id)}
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Destino</TableHead>
                    <TableHead className="text-right">
                      Precio Original
                    </TableHead>
                    <TableHead className="text-right">Precio Promo</TableHead>
                    <TableHead>Vigencia</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((promo) => (
                    <TableRow key={promo.id}>
                      <TableCell className="font-medium">
                        {promo.title}
                      </TableCell>
                      <TableCell>{promo.destination}</TableCell>
                      <TableCell className="text-right">
                        ${promo.original_price.toLocaleString()}{" "}
                        {promo.currency}
                      </TableCell>
                      <TableCell className="text-right font-medium text-primary">
                        ${promo.promo_price.toLocaleString()} {promo.currency}
                      </TableCell>
                      <TableCell className="text-sm">
                        {promo.start_date} / {promo.end_date}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={promo.is_active ? "default" : "secondary"}
                        >
                          {promo.is_active ? "Activa" : "Inactiva"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {hasPermissionEnableDisable && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleActive(promo.id)}
                            >
                              {promo.is_active ? (
                                <ToggleRight className="h-4 w-4 text-green-600" />
                              ) : (
                                <ToggleLeft className="h-4 w-4" />
                              )}
                            </Button>
                          )}

                          {hasPermissionUpdate && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEdit(promo)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          )}

                          {hasPermissionDelete && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Eliminar</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    ¿Estás seguro?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    Cancelar
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(promo.id)}
                                  >
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
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif">
              {editingPromo ? "Editar Promoción" : "Nueva Promoción"}
            </DialogTitle>
            <DialogDescription>
              {editingPromo
                ? "Modifica los datos."
                : "Crea una nueva promoción."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Título *</Label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Destino *</Label>
              <Input
                value={formData.destination}
                onChange={(e) =>
                  setFormData({ ...formData, destination: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Descripción *</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Precio Original</Label>
                <Input
                  type="number"
                  value={formData.original_price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      original_price: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Precio Promo</Label>
                <Input
                  type="number"
                  value={formData.promo_price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      promo_price: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Moneda</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(val) =>
                    setFormData({ ...formData, currency: val as Currency })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="MXN">MXN</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Fecha inicio</Label>
                <Input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) =>
                    setFormData({ ...formData, start_date: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Fecha fin</Label>
                <Input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) =>
                    setFormData({ ...formData, end_date: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Subir imagen</Label>
              <Input type="file" onChange={handleFileChange} accept="image/*" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                disabled={
                  !file ||
                  !formData.title ||
                  !formData.destination ||
                  formData.promo_price < 0
                }
              >
                {editingPromo ? "Guardar Cambios" : "Crear Promoción"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
