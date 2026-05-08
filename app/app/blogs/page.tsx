"use client"

import { useEffect, useState, ChangeEvent } from "react"
import { Plus, Pencil, Trash2, Search, Eye, FileText, FilePenLine } from "lucide-react"
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
import type { Blog, BlogStatus } from "../lib/types"
import { defaultApiAuth } from "../lib/api"
import { useAuth } from "../auth/AuthContext"
import { useToast } from "@/hooks/use-toast"

const blogActionDelete = "BLOG_DELETE";
const blogActionUpdate = "BLOG_UPDATE";
const blogActionCreate = "BLOG_CREATE";

function slugify(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null)
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "", slug: "", content: "", excerpt: "", cover_image_url: "", status: "Borrador" as BlogStatus,
  })
  const [file, setFile] = useState<File | null>(null)
  const filtered = blogs.filter((b) => {
    const matchSearch = b.title.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === "all" || b.status === filterStatus
    return matchSearch && matchStatus
  })

  const publishedCount = blogs.filter((b) => b.status === "Publicado").length
  const draftCount = blogs.filter((b) => b.status === "Borrador").length

  const hasPermissionDelete = user?.permissions.includes(blogActionDelete);
  const hasPermissionUpdate = user?.permissions.includes(blogActionUpdate);
  const hasPermissionCreate = user?.permissions.includes(blogActionCreate);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) {
        setFile(e.target.files[0])
      }
    };

  const openCreate = () => {
    setEditingBlog(null)
    setFile(null)
    setFormData({ title: "", slug: "", content: "", excerpt: "", cover_image_url: "", status: "Borrador" })
    setDialogOpen(true)
  }

  const openEdit = (blog: Blog) => {
    setEditingBlog(blog)
    setFile(null)
    setFormData({
      title: blog.title, 
      slug: blog.slug, 
      content: blog.content, 
      excerpt: blog.excerpt, 
      cover_image_url: blog.cover_image_url || "", 
      status: blog.status,
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {

    const form = new FormData()
    form.append("image", !file ? "" : file);

    if (editingBlog) {

      const obj = {
        ...formData,
        id: editingBlog.id
      };

      form.append("blogRequest",
      new Blob(
        [JSON.stringify(obj)],
        { type: "application/json" }
      ))

      try {
        const updatedBlog: any = await defaultApiAuth.putBlog(form);
        if (!updatedBlog) {
          console.warn("Blog not found -> " + editingBlog.id);
          toast({ title: "Alerta", description: `El blog [${formData.title}] no fue encontrado.`, variant: "warning" });
          return;
        }
        console.log("Blog updated -> ", updatedBlog.id);
        setBlogs((prev) => prev.map((b) => b.id === editingBlog.id ? updatedBlog : b));
        toast({ title: "Blog actualizado", description: `El blog [${updatedBlog.title}] fue actualizado correctamente.`, variant: "success" });
      } catch (error) {
        console.error("Error updating blog -> " + editingBlog.id, error);
        toast({ title: "Error", description: `No se pudo actualizar el blog [${formData.title}].`, variant: "destructive" });
      }

    } else {

      const obj = {
        ...formData,
        created_by: user?.userId,
      };

      form.append("blogRequest",
      new Blob(
        [JSON.stringify(obj)],
        { type: "application/json" }
      ))

      try {
        const newBlog: any = await defaultApiAuth.postBlog(form);
        if (!newBlog) {
          console.warn("Error creating blog");
          toast({ title: "Alerta", description: `No se pudo crear el blog [${formData.title}].`, variant: "warning" });
          return;
        }
        console.log("Blog created -> ", newBlog.id);
        setBlogs((prev) => [...prev, newBlog]);
        toast({ title: "Blog creado", description: `El blog [${newBlog.title}] fue creado correctamente.`, variant: "success" });
      } catch (error) {
        console.error("Error creating blog", error);
        toast({ title: "Error", description: `No se pudo crear el blog [${formData.title}].`, variant: "destructive" });
      }

    }
    setDialogOpen(false)
  }

  const handleDelete = async (id: string) => {
    try {
      const responseId = await defaultApiAuth.deleteBlog(id);
      if (!responseId) {
        console.warn("Blog not found -> " + id);
        toast({ title: "Alerta", description: `El blog [${id}] no fue encontrado.`, variant: "warning" });
        return;
      }
      console.log("Blog deleted -> ", responseId);
      setBlogs((prev) => prev.filter((b) => b.id !== responseId));
      toast({ title: "Blog eliminado", description: `El blog [${responseId}] fue eliminado correctamente.`, variant: "success" });
    } catch (error) {
      console.error("Error deleting blog -> " + id, error);
      toast({ title: "Error", description: `No se pudo eliminar el blog [${id}].`, variant: "destructive" });
    }
  }

  useEffect(() => {
    const fetchBlogs = async () => {
      const response = await defaultApiAuth.getBlogs();
      console.log("Blogs list fetched -> ", response.length);
      setBlogs(response);
      toast({ title: "Blogs cargados", description: `Se cargaron ${response.length} blogs.`, variant: "success" });
    };
    fetchBlogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Blogs</h1>
          <p className="text-sm text-muted-foreground">Gestiona tus artículos y publicaciones</p>
        </div>

        {hasPermissionCreate && (
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Artículo
        </Button>
        )}
        
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{blogs.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Publicados</CardTitle>
            <Eye className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-green-600">{publishedCount}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Borradores</CardTitle>
            <FilePenLine className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-yellow-600">{draftCount}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg">Artículos</CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Estado" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Publicado">Publicados</SelectItem>
                  <SelectItem value="Borrador">Borradores</SelectItem>
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
                  <TableHead>Título</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Extracto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha de Publicación</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((blog) => (
                  <TableRow key={blog.id}>
                    <TableCell className="font-medium">{blog.title}</TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">{blog.slug}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">{blog.excerpt}</TableCell>
                    <TableCell>
                      <Badge variant={blog.status === "Publicado" ? "default" : "secondary"}>
                        {blog.status === "Publicado" ? "Publicado" : "Borrador"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {blog.published_at
                        ? new Date(blog.published_at).toLocaleDateString("es-MX")
                        : "" }
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {hasPermissionUpdate && (
                          <Button variant="ghost" size="icon" onClick={() => openEdit(blog)} title="Editar"><Pencil className="h-4 w-4" /></Button>
                        )}

                        {hasPermissionDelete && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader><AlertDialogTitle>Eliminar artículo</AlertDialogTitle><AlertDialogDescription>¿Estás seguro de eliminar "{blog.title}"?</AlertDialogDescription></AlertDialogHeader>
                            <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(blog.id)}>Eliminar</AlertDialogAction></AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        )}
                        
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="h-24 text-center text-muted-foreground">No se encontraron artículos.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif">{editingBlog ? "Editar Artículo" : "Nuevo Artículo"}</DialogTitle>
            <DialogDescription>{editingBlog ? "Modifica el contenido." : "Crea un nuevo artículo."}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Título *</Label><Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: slugify(e.target.value) })} /></div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="font-mono text-sm" />
            </div>
            <div className="space-y-2"><Label>Extracto *</Label><Textarea value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} rows={2} /></div>
            <div className="space-y-2"><Label>Contenido *</Label><Textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} rows={10} className="font-mono text-sm" /></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Imagen de portada (URL)</Label>
                <Input type="file" onChange={handleFileChange} accept="image/*" />
                {/* <Input value={formData.cover_image_url} onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })} placeholder="/imagen.jpg" /> */}
              </div>
              <div className="space-y-2"><Label>Estado</Label>
                <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val as BlogStatus })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="Borrador">Borrador</SelectItem><SelectItem value="Publicado">Publicado</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSave} disabled={!formData.title || !formData.excerpt || !formData.content || !file}>
                {editingBlog ? "Guardar Cambios" : "Crear Artículo"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
