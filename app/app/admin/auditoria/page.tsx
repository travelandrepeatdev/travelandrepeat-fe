"use client"

import { useState } from "react"
import { Search, ClipboardList, Filter } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { mockAuditLogs } from "../../lib/mock-data"

const actionColors: Record<string, string> = {
  CREATE: "bg-green-600 hover:bg-green-700",
  UPDATE: "bg-blue-600 hover:bg-blue-700",
  DELETE: "bg-destructive hover:bg-destructive/90",
  LOGIN: "bg-[#9473d4] hover:bg-[#7962a8]",
}

const entityTypes = ["Todos", "user", "client", "commission", "promotion", "blog", "role"]
const actionTypes = ["Todos", "CREATE", "UPDATE", "DELETE", "LOGIN"]

export default function AuditoriaPage() {
  const [search, setSearch] = useState("")
  const [entityFilter, setEntityFilter] = useState("Todos")
  const [actionFilter, setActionFilter] = useState("Todos")

  const filtered = mockAuditLogs.filter((log) => {
    const matchesSearch =
      log.user_name.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.entity_id.toLowerCase().includes(search.toLowerCase())
    const matchesEntity = entityFilter === "Todos" || log.entity_type === entityFilter
    const matchesAction = actionFilter === "Todos" || log.action === actionFilter
    return matchesSearch && matchesEntity && matchesAction
  })

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("es-MX", {
      year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    })

  // Stats
  const totalActions = mockAuditLogs.length
  const createCount = mockAuditLogs.filter((l) => l.action === "CREATE").length
  const updateCount = mockAuditLogs.filter((l) => l.action === "UPDATE").length
  const uniqueUsers = new Set(mockAuditLogs.map((l) => l.user_id)).size

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Auditoria</h1>
          <p className="text-sm text-muted-foreground">Registro de actividades del sistema (solo lectura)</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ClipboardList className="h-4 w-4" />
          <span>{mockAuditLogs.length} registros</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{totalActions}</p>
              <p className="text-sm text-muted-foreground">Total Acciones</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{createCount}</p>
              <p className="text-sm text-muted-foreground">Creaciones</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{updateCount}</p>
              <p className="text-sm text-muted-foreground">Actualizaciones</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#9473d4]">{uniqueUsers}</p>
              <p className="text-sm text-muted-foreground">Usuarios Activos</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4">
            <CardTitle className="text-lg">Registro de Actividades</CardTitle>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Buscar por usuario, detalle o ID..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Accion" />
                  </SelectTrigger>
                  <SelectContent>
                    {actionTypes.map((a) => (
                      <SelectItem key={a} value={a}>{a}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={entityFilter} onValueChange={setEntityFilter}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Entidad" />
                  </SelectTrigger>
                  <SelectContent>
                    {entityTypes.map((e) => (
                      <SelectItem key={e} value={e}>{e === "Todos" ? "Todos" : e}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Accion</TableHead>
                  <TableHead>Entidad</TableHead>
                  <TableHead>ID Entidad</TableHead>
                  <TableHead>Detalle</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{formatDate(log.created_at)}</TableCell>
                    <TableCell className="font-medium">{log.user_name}</TableCell>
                    <TableCell>
                      <Badge className={actionColors[log.action] || ""}>{log.action}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">{log.entity_type}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{log.entity_id}</TableCell>
                    <TableCell className="max-w-[300px] truncate text-sm">{log.details}</TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">No se encontraron registros.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
