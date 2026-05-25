// ==========================================
// Types derived from SQL schema reference
// ==========================================

// --- Auth & Access Control ---

export interface User {
  user_id: string
  email: string
  is_active: boolean
  last_login: string | null
  display_name: string | null
  avatar_url: string | null
  created_at: string | null
  updated_at: string | null
  role: string | null
}

export interface UserProfile {
    userId: string;
    name: string;
    avatar_url: string;
    role: string;
    permissions: string[];
    accessToken: string;
}

export interface Role {
  role_id: string
  name: string
  description: string | null
}

export interface Permission {
  permission_id: string
  name: string
  description: string | null
  created_at: string | null
}

export interface UserRole {
  user_id: string
  role_id: string
  assigned_at: string | null
}

export interface RolePermission {
  role_id: string
  permission_id: string
}

export interface UserPermission {
  user_id: string
  permission_id: string
  permission_name: string
}

// --- Business Entities ---

export interface Client {
  id: string
  name: string
  email: string
  phone: string
  country_code: string
  address: string
  notes: string | null
  created_by: string | null
  created_at: string | null
  updated_at: string | null
}

export interface Provider {
  id: string
  name: string
  contact_name: string
  email: string
  phone: string
  category: ProviderCategory
  website: string | null
  notes: string | null
  created_by: string | null
  created_at: string | null
  updated_at: string | null
}

export type ProviderCategory =
  | "Aerolíneas"
  | "Hoteles"
  | "Tour Operadores"
  | "Seguros"
  | "Cruceros"
  | "Renta de Autos"
  | "Parques Temáticos"
  | "Otro"

export type Currency = "MXN" | "USD"

export type CommissionStatus = "Pendiente" | "Pagada" | "Cancelada" | "Parcial"

export interface Commission {
  id: string
  client_id: string
  client_name: string
  provider_id: string
  provider_name: string
  description: string
  amount: number
  currency: Currency
  exchange_rate: number
  amount_mxn: number
  amount_usd: number
  status: CommissionStatus
  commission_date: string
  payment_method: string
  installments: number
  created_by: string
  created_at: string
  updated_at: string
}

export type ExpenseCategory =
  | "Viaje"
  | "Marketing"
  | "Software"
  | "Oficina"
  | "Impuestos"
  | "Capacitación"
  | "Otro"

export interface Expense {
  id: string
  description: string
  category: ExpenseCategory
  amount: number
  currency: Currency
  exchange_rate: number
  amount_mxn: number
  amount_usd: number
  expense_date: string
  payment_method: string
  receipt_url: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export interface Promotion {
  id: string
  order_number: number
  title: string
  description: string
  destination: string
  promo_price: number
  currency: Currency
  image_url: string | null
  is_active: boolean
  created_by: string | null
  created_at: string | null
  updated_at: string | null
}

export type BlogStatus = "Borrador" | "Publicado"

export interface Blog {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  cover_image_url: string | null
  status: BlogStatus
  published_at: string | null
  created_by: string | null
  created_at: string | null
  updated_at: string | null
}

export interface AuditLog {
  id: string
  user_id: string
  user_name: string
  action: string
  entity_type: string
  entity_id: string
  details: string
  created_at: string
}

export interface Dashboard0 {
  totalClients: string | null
  totalProviders: string | null
  activePromotions: string | null
  publishedBlogs: string | null
}

export interface Dashboard1 {

}

export interface Dashboard2 {
  
}

// --- API Response types ---

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  total: number
  page: number
  per_page: number
}