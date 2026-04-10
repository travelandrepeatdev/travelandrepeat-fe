"use client"

import { ChangeEvent, useEffect, useState } from "react"
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
import { defaultApiAuth } from "../lib/api"
import { useToast } from "@/hooks/use-toast"

const promotionActionDelete = "PROMOTION_DELETE";
const promotionActionUpdate = "PROMOTION_UPDATE";
const promotionActionCreate = "PROMOTION_CREATE";
const promotionActionEnableDisable = "PROMOTION_ENABLE_DISABLE";
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
    title: "", description: "", destination: "", promo_price: 0,
    currency: "USD" as Currency, is_active: true, created_by: "",
    image_url: ""
  })
  const { toast } = useToast();
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
      title: "", description: "", destination: "", promo_price: 0, 
      currency: "USD", is_active: true, created_by: "",
      image_url: ""
    })
    setDialogOpen(true)
  }

  const openEdit = (promo: Promotion) => {
    setEditingPromo(promo)
    setFile(null)
    setFormData({
      title: promo.title, description: promo.description, destination: promo.destination,
      promo_price: promo.promo_price, currency: promo.currency, 
      is_active: promo.is_active,
      created_by: "", image_url: promo.image_url || ""
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {

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

      try {
        const response: any = await defaultApiAuth.putPromotion(form);
        if (!response) {
          console.warn("Promotion not found -> " + editingPromo.id);
          toast({ title: "Alerta", description: `La promoción [${formData.title}] no fue encontrada.`, variant: "warning" });
          return;
        }
        console.log("Promotion updated -> ", response.id);
        setPromotions((prev) => prev.map((p) => p.id === editingPromo.id ? response : p));
        toast({ title: "Promoción actualizada", description: `[${response.title}] fue modificado correctamente.`, variant: "success" });
      } catch (error) {
        console.error("Error updating promotion -> " + editingPromo.id, error);
        toast({ title: "Error", description: `No se pudo actualizar la promoción [${formData.title}].`, variant: "destructive" });
      }

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

      try {
        const response: any = await defaultApiAuth.postPromotion(form);
        if (!response) {
          console.warn("Promotion not created");
          toast({ title: "Alerta", description: `No se pudo crear la promoción [${formData.title}].`, variant: "warning" });
          return;
        }
        console.log("Promotion created -> ", response.id);
        toast({ title: "Promoción creada", description: `[${response.title}] fue creada correctamente.`, variant: "success" });
        setPromotions((prev) => [...prev, response])
      } catch (error) {
        console.error("Error creating promotion", error);
        toast({ title: "Error", description: `No se pudo crear la promoción [${formData.title}].`, variant: "destructive" });
      }

    }
    setDialogOpen(false)
  }

  const toggleActive = async (id: string) => {
    try {
      const response = await defaultApiAuth.putPromotionEnableDisable(id);
      if (!response) {
        console.warn("Promotion not found -> " + id);
        toast({ title: "Alerta", description: `La promoción [${id}] no fue encontrada.`, variant: "warning" });
        return;
      }
      console.log("Promotion toggled active -> ", response.is_active);
      setPromotions((prev) => prev.map((p) => p.id === id ? { ...p, is_active: !p.is_active } : p));
      toast({ title: `Promoción ${response.is_active ? "activada" : "desactivada"}`, description: `La promoción [${id}] fue ${response.is_active ? "activada" : "desactivada"} correctamente.`, variant: response.is_active ? "success" : "warning" });
    } catch (error) {
      console.error("Error toggling promotion -> " + id, error);
      toast({ title: "Error", description: `No se pudo cambiar el estado de la promoción [${id}].`, variant: "destructive" });
    }
  }

  const handleDelete = async (id: string) => {
    try {      
      const responseId = await defaultApiAuth.deletePromotion(id);
      if (!responseId) {
        console.warn("Promotion not found -> " + id);
        toast({ title: "Alerta", description: `La promoción [${id}] no fue encontrada.`, variant: "warning" });
        return;
      }
      console.log("Promotion deleted -> ", responseId);
      setPromotions((prev) => prev.filter((p) => p.id !== responseId));
      toast({ title: "Promoción eliminada", description: `La promoción [${id}] fue eliminada correctamente.`, variant: "success" });
    } catch (error) {
      console.error("Error deleting promotion -> " + id, error);
      toast({ title: "Error", description: `No se pudo eliminar la promoción [${id}].`, variant: "destructive" });
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0])
    }
  };

  useEffect(() => { 
    const fetchPromotions = async () => {
        const response = await defaultApiAuth.getPromotions();
        console.log("Promotions list fetched -> ", response.length);
        setPromotions(response);
        toast({ title: "Promociones cargadas", description: `Se cargaron ${response.length} promociones.`, variant: "success" });
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
                </div>

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
                    <TableHead className="text-right">Precio Original</TableHead>
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
                      <TableCell className="text-right font-medium text-primary">
                        ${promo.promo_price.toLocaleString()} {promo.currency}
                      </TableCell>
                      <TableCell>
                        <Badge variant={promo.is_active ? "default" : "secondary"}>
                          {promo.is_active ? "Activa" : "Inactiva"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {hasPermissionEnableDisable && (
                            <Button variant="ghost" size="icon" onClick={() => toggleActive(promo.id)}>
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
