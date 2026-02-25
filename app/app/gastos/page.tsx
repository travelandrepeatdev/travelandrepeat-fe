"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, Search, TrendingDown, DollarSign, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { mockExpenses } from "../lib/mock-data"
import type { Expense, ExpenseCategory, Currency } from "../lib/types"

const expenseCategories: ExpenseCategory[] = [
  "Viaje", "Marketing", "Software", "Oficina", "Impuestos", "Capacitación", "Otro",
]

const categoryColors: Record<ExpenseCategory, string> = {
  "Viaje": "bg-blue-100 text-blue-800",
  "Marketing": "bg-purple-100 text-purple-800",
  "Software": "bg-cyan-100 text-cyan-800",
  "Oficina": "bg-yellow-100 text-yellow-800",
  "Impuestos": "bg-red-100 text-red-800",
  "Capacitación": "bg-green-100 text-green-800",
  "Otro": "bg-gray-100 text-gray-800",
}

export default function GastosPage() {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses)
  const [search, setSearch] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)

  const [formData, setFormData] = useState({
    description: "", category: "Otro" as ExpenseCategory, amount: 0, currency: "MXN" as Currency,
    exchange_rate: 17.25, expense_date: "", payment_method: "",
  })

  const filtered = expenses.filter((e) => {
    const matchSearch = e.description.toLowerCase().includes(search.toLowerCase())
    const matchCategory = filterCategory === "all" || e.category === filterCategory
    return matchSearch && matchCategory
  })

  const totalMXN = expenses.reduce((sum, e) => sum + e.amount_mxn, 0)
  const totalUSD = expenses.reduce((sum, e) => sum + e.amount_usd, 0)

  const byCategory = expenseCategories.map((cat) => ({
    category: cat,
    total: expenses.filter((e) => e.category === cat).reduce((sum, e) => sum + e.amount_mxn, 0),
  })).filter((c) => c.total > 0).sort((a, b) => b.total - a.total)

  const openCreate = () => {
    setEditingExpense(null)
    setFormData({ description: "", category: "Otro", amount: 0, currency: "MXN", exchange_rate: 17.25, expense_date: "", payment_method: "" })
    setDialogOpen(true)
  }

  const openEdit = (expense: Expense) => {
    setEditingExpense(expense)
    setFormData({
      description: expense.description,
      category: expense.category,
      amount: expense.amount,
      currency: expense.currency,
      exchange_rate: expense.exchange_rate,
      expense_date: expense.expense_date.split("T")[0],
      payment_method: expense.payment_method,
    })
    setDialogOpen(true)
  }

  const handleSave = () => {
    const amountMXN = formData.currency === "MXN" ? formData.amount : formData.amount * formData.exchange_rate
    const amountUSD = formData.currency === "USD" ? formData.amount : formData.amount / formData.exchange_rate

    if (editingExpense) {
      setExpenses((prev) =>
        prev.map((e) =>
          e.id === editingExpense.id
            ? { ...e, ...formData, amount_mxn: amountMXN, amount_usd: amountUSD, updated_at: new Date().toISOString() }
            : e
        )
      )
    } else {
      const newExpense: Expense = {
        id: `e-${Date.now()}`,
        ...formData,
        amount_mxn: amountMXN,
        amount_usd: amountUSD,
        receipt_url: null,
        created_by: "u-002",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setExpenses((prev) => [...prev, newExpense])
    }
    setDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Gastos</h1>
          <p className="text-sm text-muted-foreground">Registra y controla tus gastos operativos</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Gasto
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-red-500/20 bg-red-500/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total MXN</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-red-600">${totalMXN.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total USD</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-blue-600">${totalUSD.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Por Categoría</CardTitle>
            <BarChart3 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {byCategory.slice(0, 3).map((c) => (
                <div key={c.category} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{c.category}</span>
                  <span className="font-medium">${c.total.toLocaleString("es-MX")}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg">Listado de Gastos</CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="Categoría" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {expenseCategories.map((cat) => (<SelectItem key={cat} value={cat}>{cat}</SelectItem>))}
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
                  <TableHead>Descripción</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                  <TableHead className="text-right">MXN</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium max-w-[200px] truncate">{expense.description}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryColors[expense.category]}`}>
                        {expense.category}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">${expense.amount.toLocaleString()} {expense.currency}</TableCell>
                    <TableCell className="text-right font-medium">${expense.amount_mxn.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell>{expense.payment_method}</TableCell>
                    <TableCell>{new Date(expense.expense_date).toLocaleDateString("es-MX")}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(expense)} title="Editar"><Pencil className="h-4 w-4" /></Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" title="Eliminar"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Eliminar gasto</AlertDialogTitle>
                              <AlertDialogDescription>¿Estás seguro de eliminar este gasto? Esta acción no se puede deshacer.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(expense.id)}>Eliminar</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={7} className="h-24 text-center text-muted-foreground">No se encontraron gastos.</TableCell></TableRow>
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
            <DialogTitle className="font-serif">{editingExpense ? "Editar Gasto" : "Nuevo Gasto"}</DialogTitle>
            <DialogDescription>{editingExpense ? "Modifica los datos del gasto." : "Registra un nuevo gasto."}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Descripción *</Label>
              <Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Categoría *</Label>
                <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val as ExpenseCategory })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map((cat) => (<SelectItem key={cat} value={cat}>{cat}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Fecha *</Label>
                <Input type="date" value={formData.expense_date} onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })} />
              </div>
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
            <div className="space-y-2">
              <Label>Método de pago</Label>
              <Input value={formData.payment_method} onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })} placeholder="Transferencia, Tarjeta, Efectivo..." />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSave} disabled={!formData.description || formData.amount <= 0}>
                {editingExpense ? "Guardar Cambios" : "Registrar Gasto"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
