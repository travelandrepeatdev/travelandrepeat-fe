import axios, { AxiosResponse } from "axios"
import { Blog, Client, Dashboard0, Permission, Promotion, Provider, Role, RolePermission, User, UserProfile, UserRole } from "./types";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const apiNoAuth = axios.create({baseURL: apiBaseUrl});
const apiAuth = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true
});

function handleApiError(error: any) {
  switch (error.response?.status) {
    case 401:
      console.warn("Unauthorized - logging out");
      break;
    case 403:
      console.warn("Forbidden - insufficient permissions");
      break;
    case 404:
      console.warn("Not Found - invalid endpoint");
      break;
    case 500:
      console.error("Server Error - check backend logs");
      break;
    default:
      console.error("API Error", error);
  }
}

apiAuth.interceptors.response.use((response) => response, (error) => {
  handleApiError(error);
});
apiNoAuth.interceptors.response.use((response) => response, (error) => {
  handleApiError(error);
});

// --- Generic CRUD helpers with NO AUTH ----------------------------------------------

export async function getOne<T>(endpoint: string): Promise<T> {
  const { data } = await apiNoAuth.get<T>(endpoint)
  if (!data) throw new Error("Error al obtener dato")
  return data as T
}

export async function getList<T>(endpoint: string): Promise<T[]> {
  const { data } = await apiNoAuth.get<T[]>(endpoint)
  if (!data) throw new Error("Error al obtener datos")
  return data || []
}

export async function postData<T>(endpoint: string, payload: Partial<T>): Promise<T> {
  const { data } = await apiNoAuth.post<T>(endpoint, payload)
  if (!data) throw new Error("Error al enviar datos")
  return data as T
}

// --- API functions with NO AUTH ------------------------------------------------------

export const publicApi = {
  getDollarRate: () => getOne<string>("/dollar/rate"),
  getPromotions: () => getList<Promotion>("/promotions/promotionListActive"),
  postQuotation: (payload: any) => postData<string>("/mail/sendQuotationForm", payload),
}

// --- Generic CRUD helpers with AUTH --------------------------------------------------

export async function fetch<T>(endpoint: string): Promise<T> {
  const { data } = await apiAuth.get<T>(endpoint)
  if (!data) throw new Error("Error al obtener dato")
  return data as T
}

export async function sendLogin<T>(endpoint: string, payload: Partial<T>): Promise<T> {
  const data = await apiAuth.post<T>(endpoint, payload);
  if (!data) throw new Error("Error del servidor. Por favor, intenta de nuevo dentro de unos minutos.");

  // match with backend responses
  switch (data.data) {
    case "USER_NOT_FOUND":
      throw new Error("El usuario no existe. Verifica tu correo electrónico.");
    case "INVALID_PASSWORD":
      throw new Error("Contraseña incorrecta. Intenta de nuevo.");
    case "ACCOUNT_DISABLED":
      throw new Error("Tu cuenta ha sido deshabilitada. Contacta al administrador.");
    default:
      return data as T;
  }
}

export async function sendLogout<T>(endpoint: string): Promise<T> {
  const { data } = await apiAuth.post<T>(endpoint)
  if (!data) throw new Error("Error al cerrar sesión")
  return data as T
}

export async function createData<T>(endpoint: string, payload: Partial<T>): Promise<T> {
  const { data } = await apiAuth.post<T>(endpoint, payload)
  if (!data) throw new Error("Error al crear")
  return data as T
}

export async function createUserData<T>(endpoint: string, payload: Partial<T>): Promise<AxiosResponse<T>> {
  return await apiAuth.post<T>(endpoint, payload);
}

export async function updateUserData<T>(endpoint: string, payload: Partial<T>): Promise<AxiosResponse<T>> {
  return await apiAuth.put<T>(endpoint, payload);
}

export async function updateData<T>(endpoint: string, payload: Partial<T>): Promise<T> {
  const { data } = await apiAuth.put<T>(endpoint, payload)
  if (!data) throw new Error("Error al actualizar")
  return data as T
}

export async function updateListData<T>(endpoint: string, payload: Partial<T[]>): Promise<T[]> {
  const { data } = await apiAuth.put<T>(endpoint, payload)
  if (!data) throw new Error("Error al actualizar lista")
  return data as T[]
}

export async function deleteData<T>(endpoint: string): Promise<T> {
  const { data } = await apiAuth.delete<T>(endpoint)
  if (!data) throw new Error("Error al eliminar")
  return data as T
}

// --- API functions with AUTH ---------------------------------------------------------

export const defaultApiAuth = {
  // Dashboard
  getStats: () => fetch<Dashboard0>("/dashboard/stats"),

  // Auth
  getProfile: () => fetch<UserProfile>("/auth/profile"),
  postLogin: (payload: any) => sendLogin<string>("/auth/login", payload),
  postLogout: () => sendLogout<string>("/auth/logout"),

  // Blogs
  getBlogs: () => fetch<Blog[]>("/blogs"),
  postBlog: (payload: Blog) => createData<Blog>("/blogs", payload),
  putBlog: (payload: Blog) => updateData<Blog>("/blogs", payload),
  deleteBlog: (blogId: string) => deleteData<string>("/blogs/" + blogId),

  // Users
  getUsers: () => fetch<User[]>("/users"),
  postUser: (payload: User) => createUserData<User>("/users", payload),
  putUser: (payload: User) => updateUserData<User>("/users", payload),
  putUserEnableDisable: (userId: string) => updateData<User>("/users/" + userId + "/enable-disable", {}),

  // User-Roles
  getUserRoles: () => fetch<UserRole[]>("/users/userRole"),
  postUserRole: (payload: Record<string, unknown>) => createUserData("/users/userRole", payload),
  putUserRole: (payload: Record<string, unknown>) => updateUserData("/users/userRole", payload),

  // Roles
  getRoles: () => fetch<Role[]>("/roles"),
  postRole: (payload: Role) => createData<Role>("/roles", payload),
  putRole: (payload: Role) => updateData<Role>("/roles", payload),
  deleteRole: (roleId: string) => deleteData<string>("/roles/" + roleId),
  
  // Role-Permissions
  getRolePermissions: () => fetch<RolePermission[]>("/roles/rolePermission"),
  putRolePermissions: (payload: RolePermission[]) => updateListData("/roles/rolePermission", payload),

  // Permisos
  getPermissions: () => fetch<Permission[]>("/permissions"),
  postPermission: (payload: Permission) => createData<Permission>("/permissions", payload),
  putPermission: (payload: Permission) => updateData<Permission>("/permissions", payload),
  deletePermission: (permissionId: string) => deleteData<string>("/permissions/" + permissionId),

  // Clientes
  getClients: () => fetch<Client[]>("/clients"),
  postClient: (payload: Client) => createData<Client>("/clients", payload),
  putClient: (payload: Client) => updateData<Client>("/clients", payload),
  deleteClient: (clientId: string) => deleteData<string>("/clients/" + clientId),

  // Proveedores
  getProviders: () => fetch<Provider[]>("/providers"),
  postProvider: (payload: Provider) => createData<Provider>("/providers", payload),
  putProvider: (payload: Provider) => updateData<Provider>("/providers", payload),
  deleteProvider: (providerId: string) => deleteData<string>("/providers/" + providerId),

  // Promociones
  getPromotions: () => fetch<Promotion[]>("/promotions"),
  postPromotion: (payload: FormData) => createData("/promotions", payload),
  putPromotion: (payload: FormData) => updateData("/promotions", payload),
  deletePromotion: (promotionId: string) => deleteData<string>("/promotions/" + promotionId),
  putPromotionEnableDisable: (promotionId: string) => updateData<Promotion>("/promotions/" + promotionId + "/enable-disable", {}),
}