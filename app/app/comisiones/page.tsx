"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, Search, TrendingUp, DollarSign, Calculator, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { mockCommissions, mockClients, mockProviders } from "../lib/mock-data"
import type { Commission, CommissionStatus, Currency } from "../lib/types"

const statusColors: Record<CommissionStatus, string> = {
  "Pendiente": "bg-yellow-100 text-yellow-800",
  "Pagada": "bg-green-100 text-green-800",
  "Cancelada": "bg-red-100 text-red-800",
  "Parcial": "bg-blue-100 text-blue-800",
}

export default function ComisionesPage() {
  const [commissions, setCommissions] = useState<Commission[]>(mockCommissions)
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCommission, setEditingCommission] = useState<Commission | null>(null)

  const [formData, setFormData] = useState({
    client_id: "", provider_id: "", description: "", amount: 0, currency: "USD" as Currency,
    exchange_rate: 17.25, status: "Pendiente" as CommissionStatus, commission_date: "",
    payment_method: "", installments: 1,
  })

  const filtered = commissions.filter((c) => {
    const matchSearch =
      c.client_name.toLowerCase().includes(search.toLowerCase()) ||
      c.provider_name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === "all" || c.status === filterStatus
    return matchSearch && matchStatus
  })

  const activeCommissions = commissions.filter((c) => c.status !== "Cancelada")
  const totalMXN = activeCommissions.reduce((sum, c) => sum + c.amount_mxn, 0)
  const totalUSD = activeCommissions.reduce((sum, c) => sum + c.amount_usd, 0)
  const avgCommission = activeCommissions.length > 0 ? totalMXN / activeCommissions.length : 0

  const openCreate = () => {
    setEditingCommission(null)
    setFormData({ client_id: "", provider_id: "", description: "", amount: 0, currency: "USD", exchange_rate: 17.25, status: "Pendiente", commission_date: "", payment_method: "", installments: 1 })
    setDialogOpen(true)
  }

  const openEdit = (commission: Commission) => {
    setEditingCommission(commission)
    setFormData({
      client_id: commission.client_id,
      provider_id: commission.provider_id,
      description: commission.description,
      amount: commission.amount,
      currency: commission.currency,
      exchange_rate: commission.exchange_rate,
      status: commission.status,
      commission_date: commission.commission_date.split("T")[0],
      payment_method: commission.payment_method,
      installments: commission.installments,
    })
    setDialogOpen(true)
  }

  const handleSave = () => {
    const client = mockClients.find((c) => c.id === formData.client_id)
    const provider = mockProviders.find((p) => p.id === formData.provider_id)
    const amountMXN = formData.currency === "MXN" ? formData.amount : formData.amount * formData.exchange_rate
    const amountUSD = formData.currency === "USD" ? formData.amount : formData.amount / formData.exchange_rate

    if (editingCommission) {
      setCommissions((prev) =>
        prev.map((c) =>
          c.id === editingCommission.id
            ? { ...c, ...formData, client_name: client?.name || c.client_name, provider_name: provider?.name || c.provider_name, amount_mxn: amountMXN, amount_usd: amountUSD, updated_at: new Date().toISOString() }
            : c
        )
      )
    } else {
      const newCommission: Commission = {
        id: `cm-${Date.now()}`,
        ...formData,
        client_name: client?.name || "",
        provider_name: provider?.name || "",
        amount_mxn: amountMXN,
        amount_usd: amountUSD,
        created_by: "u-002",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setCommissions((prev) => [...prev, newCommission])
    }
    setDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    setCommissions((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Comisiones</h1>
          <p className="text-sm text-muted-foreground">Gestiona tus comisiones por ventas</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Nueva Comisión
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total MXN</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-green-600">${totalMXN.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total USD</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-blue-600">${totalUSD.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Promedio MXN</CardTitle>
            <Calculator className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-primary">${avgCommission.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Registros</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{activeCommissions.length}</div>
            <p className="text-xs text-muted-foreground">{commissions.filter((c) => c.status === "Cancelada").length} canceladas</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg">Listado de Comisiones</CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                  <SelectItem value="Pagada">Pagada</SelectItem>
                  <SelectItem value="Parcial">Parcial</SelectItem>
                  <SelectItem value="Cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Proveedor</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                  <TableHead className="text-right">MXN</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.client_name}</TableCell>
                    <TableCell>{c.provider_name}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{c.description}</TableCell>
                    <TableCell className="text-right">${c.amount.toLocaleString()} {c.currency}</TableCell>
                    <TableCell className="text-right font-medium">${c.amount_mxn.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[c.status]}`}>
                        {c.status}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(c.commission_date).toLocaleDateString("es-MX")}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(c)} title="Editar"><Pencil className="h-4 w-4" /></Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" title="Eliminar"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Eliminar comisión</AlertDialogTitle>
                              <AlertDialogDescription>¿Estás seguro de eliminar esta comisión? Esta acción no se puede deshacer.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(c.id)}>Eliminar</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={8} className="h-24 text-center text-muted-foreground">No se encontraron comisiones.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif">{editingCommission ? "Editar Comisión" : "Nueva Comisión"}</DialogTitle>
            <DialogDescription>{editingCommission ? "Modifica los datos de la comisión." : "Registra una nueva comisión."}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Cliente *</Label>
                <Select value={formData.client_id} onValueChange={(val) => setFormData({ ...formData, client_id: val })}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>
                    {mockClients.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Proveedor *</Label>
                <Select value={formData.provider_id} onValueChange={(val) => setFormData({ ...formData, provider_id: val })}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>
                    {mockProviders.map((p) => (<SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Descripción *</Label>
              <Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Monto *</Label>
                <Input type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Moneda</Label>
                <Select value={formData.currency} onValueChange={(val) => setFormData({ ...formData, currency: val as Currency })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MXN">MXN</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tipo de cambio</Label>
                <Input type="number" step="0.01" value={formData.exchange_rate} onChange={(e) => setFormData({ ...formData, exchange_rate: Number(e.target.value) })} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Estado</Label>
                <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val as CommissionStatus })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                    <SelectItem value="Pagada">Pagada</SelectItem>
                    <SelectItem value="Parcial">Parcial</SelectItem>
                    <SelectItem value="Cancelada">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Fecha</Label>
                <Input type="date" value={formData.commission_date} onChange={(e) => setFormData({ ...formData, commission_date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Parcialidades</Label>
                <Input type="number" min="1" value={formData.installments} onChange={(e) => setFormData({ ...formData, installments: Number(e.target.value) })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Método de pago</Label>
              <Input value={formData.payment_method} onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })} placeholder="Transferencia, Tarjeta, Efectivo..." />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSave} disabled={!formData.client_id || !formData.provider_id || !formData.description || formData.amount <= 0}>
                {editingCommission ? "Guardar Cambios" : "Crear Comisión"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
