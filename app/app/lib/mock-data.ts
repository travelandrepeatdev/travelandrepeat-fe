import type {
  User,
  Role,
  Permission,
  UserRole,
  RolePermission,
  Client,
  Provider,
  Commission,
  Expense,
  Promotion,
  Blog,
  AuditLog,
} from "./types"

// --- Users ---
export const mockUsers: User[] = [
  {
    user_id: "u-001",
    email: "admin@travelandrepeat.com",
    is_active: true,
    last_login: "2026-02-17T08:30:00Z",
    display_name: "Administrador",
    avatar_url: null,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2026-02-17T08:30:00Z",
  },
  {
    user_id: "u-002",
    email: "agente@travelandrepeat.com",
    is_active: true,
    last_login: "2026-02-16T14:00:00Z",
    display_name: "María García",
    avatar_url: null,
    created_at: "2025-03-15T00:00:00Z",
    updated_at: "2026-02-16T14:00:00Z",
  },
  {
    user_id: "u-003",
    email: "viewer@travelandrepeat.com",
    is_active: false,
    last_login: "2026-01-10T09:00:00Z",
    display_name: "Carlos López",
    avatar_url: null,
    created_at: "2025-06-01T00:00:00Z",
    updated_at: "2026-01-10T09:00:00Z",
  },
]

// --- Roles ---
export const mockRoles: Role[] = [
  { role_id: "r-001", name: "admin", description: "Acceso completo al sistema", created_at: "2025-01-01T00:00:00Z" },
  { role_id: "r-002", name: "agent", description: "Agente de viajes con acceso a módulos operativos", created_at: "2025-01-01T00:00:00Z" },
  { role_id: "r-003", name: "viewer", description: "Solo lectura de información", created_at: "2025-01-01T00:00:00Z" },
]

// --- Permissions ---
export const mockPermissions: Permission[] = [
  { permission_id: "p-001", name: "clients.read", description: "Ver catálogo de clientes", created_at: "2025-01-01T00:00:00Z" },
  { permission_id: "p-002", name: "clients.write", description: "Crear y editar clientes", created_at: "2025-01-01T00:00:00Z" },
  { permission_id: "p-003", name: "clients.delete", description: "Eliminar clientes", created_at: "2025-01-01T00:00:00Z" },
  { permission_id: "p-004", name: "providers.read", description: "Ver catálogo de proveedores", created_at: "2025-01-01T00:00:00Z" },
  { permission_id: "p-005", name: "providers.write", description: "Crear y editar proveedores", created_at: "2025-01-01T00:00:00Z" },
  { permission_id: "p-006", name: "providers.delete", description: "Eliminar proveedores", created_at: "2025-01-01T00:00:00Z" },
  { permission_id: "p-007", name: "commissions.read", description: "Ver comisiones", created_at: "2025-01-01T00:00:00Z" },
  { permission_id: "p-008", name: "commissions.write", description: "Crear y editar comisiones", created_at: "2025-01-01T00:00:00Z" },
  { permission_id: "p-009", name: "commissions.delete", description: "Eliminar comisiones", created_at: "2025-01-01T00:00:00Z" },
  { permission_id: "p-010", name: "expenses.read", description: "Ver gastos", created_at: "2025-01-01T00:00:00Z" },
  { permission_id: "p-011", name: "expenses.write", description: "Crear y editar gastos", created_at: "2025-01-01T00:00:00Z" },
  { permission_id: "p-012", name: "expenses.delete", description: "Eliminar gastos", created_at: "2025-01-01T00:00:00Z" },
  { permission_id: "p-013", name: "promotions.read", description: "Ver promociones", created_at: "2025-01-01T00:00:00Z" },
  { permission_id: "p-014", name: "promotions.write", description: "Crear y editar promociones", created_at: "2025-01-01T00:00:00Z" },
  { permission_id: "p-015", name: "promotions.delete", description: "Eliminar promociones", created_at: "2025-01-01T00:00:00Z" },
  { permission_id: "p-016", name: "blogs.read", description: "Ver blogs", created_at: "2025-01-01T00:00:00Z" },
  { permission_id: "p-017", name: "blogs.write", description: "Crear y editar blogs", created_at: "2025-01-01T00:00:00Z" },
  { permission_id: "p-018", name: "blogs.delete", description: "Eliminar blogs", created_at: "2025-01-01T00:00:00Z" },
  { permission_id: "p-019", name: "admin.users", description: "Gestionar usuarios", created_at: "2025-01-01T00:00:00Z" },
  { permission_id: "p-020", name: "admin.roles", description: "Gestionar roles", created_at: "2025-01-01T00:00:00Z" },
  { permission_id: "p-021", name: "admin.permissions", description: "Gestionar permisos", created_at: "2025-01-01T00:00:00Z" },
  { permission_id: "p-022", name: "admin.audit", description: "Ver log de auditoría", created_at: "2025-01-01T00:00:00Z" },
]

// --- User Roles ---
export const mockUserRoles: UserRole[] = [
  { user_id: "u-001", role_id: "r-001", assigned_at: "2025-01-01T00:00:00Z" },
  { user_id: "u-002", role_id: "r-002", assigned_at: "2025-03-15T00:00:00Z" },
  { user_id: "u-003", role_id: "r-003", assigned_at: "2025-06-01T00:00:00Z" },
]

// --- Role Permissions ---
export const mockRolePermissions: RolePermission[] = [
  // Admin gets all
  ...mockPermissions.map((p) => ({ role_id: "r-001", permission_id: p.permission_id })),
  // Agent gets read/write on business modules
  { role_id: "r-002", permission_id: "p-001" }, { role_id: "r-002", permission_id: "p-002" },
  { role_id: "r-002", permission_id: "p-004" }, { role_id: "r-002", permission_id: "p-005" },
  { role_id: "r-002", permission_id: "p-007" }, { role_id: "r-002", permission_id: "p-008" },
  { role_id: "r-002", permission_id: "p-010" }, { role_id: "r-002", permission_id: "p-011" },
  { role_id: "r-002", permission_id: "p-013" }, { role_id: "r-002", permission_id: "p-014" },
  { role_id: "r-002", permission_id: "p-016" }, { role_id: "r-002", permission_id: "p-017" },
  // Viewer gets read only
  { role_id: "r-003", permission_id: "p-001" }, { role_id: "r-003", permission_id: "p-004" },
  { role_id: "r-003", permission_id: "p-007" }, { role_id: "r-003", permission_id: "p-010" },
  { role_id: "r-003", permission_id: "p-013" }, { role_id: "r-003", permission_id: "p-016" },
]

// --- Clients ---
export const mockClients: Client[] = [
  { id: "c-001", name: "Juan Pérez", email: "juan@gmail.com", phone: "+525512345678", country_code: "MX", address: "CDMX, México", notes: "Cliente frecuente de Disney", created_by: "u-002", created_at: "2025-06-10T00:00:00Z", updated_at: "2026-01-15T00:00:00Z" },
  { id: "c-002", name: "Ana Martínez", email: "ana@hotmail.com", phone: "+525598765432", country_code: "MX", address: "Guadalajara, Jalisco", notes: "Prefiere cruceros", created_by: "u-002", created_at: "2025-07-20T00:00:00Z", updated_at: "2026-02-01T00:00:00Z" },
  { id: "c-003", name: "Roberto Sánchez", email: "roberto@yahoo.com", phone: "+525555443322", country_code: "MX", address: "Monterrey, N.L.", notes: null, created_by: "u-002", created_at: "2025-08-05T00:00:00Z", updated_at: "2025-12-20T00:00:00Z" },
  { id: "c-004", name: "Laura González", email: "laura@gmail.com", phone: "+525577889900", country_code: "MX", address: "Puebla, Puebla", notes: "Familia de 5 personas", created_by: "u-002", created_at: "2025-09-12T00:00:00Z", updated_at: "2026-02-10T00:00:00Z" },
  { id: "c-005", name: "John Smith", email: "john@gmail.com", phone: "+15551234567", country_code: "US", address: "Houston, TX", notes: "Interested in Cancún packages", created_by: "u-002", created_at: "2025-10-01T00:00:00Z", updated_at: "2026-01-20T00:00:00Z" },
]

// --- Providers ---
export const mockProviders: Provider[] = [
  { id: "pv-001", name: "Disney Travel Company", contact_name: "Sarah Williams", email: "bookings@disney.com", phone: "+18005551234", category: "Parques Temáticos", website: "https://disney.com", notes: "Agente autorizado", created_by: "u-002", created_at: "2025-01-15T00:00:00Z", updated_at: "2025-12-01T00:00:00Z" },
  { id: "pv-002", name: "Royal Caribbean", contact_name: "Mike Johnson", email: "agents@royalcaribbean.com", phone: "+18005555678", category: "Cruceros", website: "https://royalcaribbean.com", notes: null, created_by: "u-002", created_at: "2025-02-01T00:00:00Z", updated_at: "2025-11-15T00:00:00Z" },
  { id: "pv-003", name: "Universal Studios", contact_name: "Emily Davis", email: "travel@universalstudios.com", phone: "+18005559012", category: "Parques Temáticos", website: "https://universalstudios.com", notes: "Descuento especial agentes", created_by: "u-002", created_at: "2025-03-10T00:00:00Z", updated_at: "2026-01-10T00:00:00Z" },
  { id: "pv-004", name: "Aeroméxico", contact_name: "Carlos Ruiz", email: "agentes@aeromexico.com", phone: "+525555001234", category: "Aerolíneas", website: "https://aeromexico.com", notes: null, created_by: "u-002", created_at: "2025-04-01T00:00:00Z", updated_at: "2026-02-01T00:00:00Z" },
  { id: "pv-005", name: "Marriott Hotels", contact_name: "Jennifer Lee", email: "groups@marriott.com", phone: "+18005553456", category: "Hoteles", website: "https://marriott.com", notes: "Programa de puntos", created_by: "u-002", created_at: "2025-05-20T00:00:00Z", updated_at: "2025-12-15T00:00:00Z" },
]

// --- Commissions ---
export const mockCommissions: Commission[] = [
  { id: "cm-001", client_id: "c-001", client_name: "Juan Pérez", provider_id: "pv-001", provider_name: "Disney Travel Company", description: "Paquete Disney World 5 días", amount: 450, currency: "USD", exchange_rate: 17.25, amount_mxn: 7762.50, amount_usd: 450, status: "Pagada", commission_date: "2026-01-15T00:00:00Z", payment_method: "Transferencia", installments: 1, created_by: "u-002", created_at: "2026-01-15T00:00:00Z", updated_at: "2026-01-15T00:00:00Z" },
  { id: "cm-002", client_id: "c-002", client_name: "Ana Martínez", provider_id: "pv-002", provider_name: "Royal Caribbean", description: "Crucero Caribe 7 noches", amount: 12500, currency: "MXN", exchange_rate: 17.25, amount_mxn: 12500, amount_usd: 724.64, status: "Pendiente", commission_date: "2026-02-01T00:00:00Z", payment_method: "Tarjeta de crédito", installments: 3, created_by: "u-002", created_at: "2026-02-01T00:00:00Z", updated_at: "2026-02-01T00:00:00Z" },
  { id: "cm-003", client_id: "c-004", client_name: "Laura González", provider_id: "pv-003", provider_name: "Universal Studios", description: "Tickets Universal + Hotel 4 días", amount: 380, currency: "USD", exchange_rate: 17.30, amount_mxn: 6574, amount_usd: 380, status: "Pagada", commission_date: "2026-02-10T00:00:00Z", payment_method: "Transferencia", installments: 1, created_by: "u-002", created_at: "2026-02-10T00:00:00Z", updated_at: "2026-02-10T00:00:00Z" },
  { id: "cm-004", client_id: "c-005", client_name: "John Smith", provider_id: "pv-005", provider_name: "Marriott Hotels", description: "Hotel Cancún All-Inclusive 5 noches", amount: 600, currency: "USD", exchange_rate: 17.20, amount_mxn: 10320, amount_usd: 600, status: "Parcial", commission_date: "2026-01-20T00:00:00Z", payment_method: "PayPal", installments: 2, created_by: "u-002", created_at: "2026-01-20T00:00:00Z", updated_at: "2026-02-05T00:00:00Z" },
  { id: "cm-005", client_id: "c-003", client_name: "Roberto Sánchez", provider_id: "pv-004", provider_name: "Aeroméxico", description: "Vuelos CDMX - Orlando redondo", amount: 8500, currency: "MXN", exchange_rate: 17.25, amount_mxn: 8500, amount_usd: 492.75, status: "Cancelada", commission_date: "2025-12-20T00:00:00Z", payment_method: "Efectivo", installments: 1, created_by: "u-002", created_at: "2025-12-20T00:00:00Z", updated_at: "2026-01-05T00:00:00Z" },
]

// --- Expenses ---
export const mockExpenses: Expense[] = [
  { id: "e-001", description: "Licencia software CRM", category: "Software", amount: 49.99, currency: "USD", exchange_rate: 17.25, amount_mxn: 862.33, amount_usd: 49.99, expense_date: "2026-02-01T00:00:00Z", payment_method: "Tarjeta de crédito", receipt_url: null, created_by: "u-002", created_at: "2026-02-01T00:00:00Z", updated_at: "2026-02-01T00:00:00Z" },
  { id: "e-002", description: "Publicidad Facebook Ads", category: "Marketing", amount: 3500, currency: "MXN", exchange_rate: 17.25, amount_mxn: 3500, amount_usd: 202.90, expense_date: "2026-01-15T00:00:00Z", payment_method: "Tarjeta de crédito", receipt_url: null, created_by: "u-002", created_at: "2026-01-15T00:00:00Z", updated_at: "2026-01-15T00:00:00Z" },
  { id: "e-003", description: "Viaje de familiarización Orlando", category: "Viaje", amount: 1200, currency: "USD", exchange_rate: 17.30, amount_mxn: 20760, amount_usd: 1200, expense_date: "2026-01-20T00:00:00Z", payment_method: "Transferencia", receipt_url: null, created_by: "u-002", created_at: "2026-01-20T00:00:00Z", updated_at: "2026-01-20T00:00:00Z" },
  { id: "e-004", description: "Papelería y material oficina", category: "Oficina", amount: 850, currency: "MXN", exchange_rate: 17.25, amount_mxn: 850, amount_usd: 49.28, expense_date: "2026-02-10T00:00:00Z", payment_method: "Efectivo", receipt_url: null, created_by: "u-002", created_at: "2026-02-10T00:00:00Z", updated_at: "2026-02-10T00:00:00Z" },
  { id: "e-005", description: "Curso certificación Disney", category: "Capacitación", amount: 200, currency: "USD", exchange_rate: 17.20, amount_mxn: 3440, amount_usd: 200, expense_date: "2025-12-05T00:00:00Z", payment_method: "PayPal", receipt_url: null, created_by: "u-002", created_at: "2025-12-05T00:00:00Z", updated_at: "2025-12-05T00:00:00Z" },
]

// --- Promotions ---
export const mockPromotions: Promotion[] = [
  { id: "pr-001", title: "Disney World Primavera 2026", description: "Paquete 5 días / 4 noches con hotel y tickets a los 4 parques de Disney World. Incluye transportación aeropuerto-hotel.", destination: "Orlando, FL", original_price: 1800, promo_price: 1499, currency: "USD", image_url: "/universal-studios-orlando-wizarding-world.jpg", start_date: "2026-03-01", end_date: "2026-05-31", is_active: true, created_by: "u-002", created_at: "2026-02-01T00:00:00Z", updated_at: "2026-02-01T00:00:00Z" },
  { id: "pr-002", title: "Crucero Caribe Royal Caribbean", description: "Crucero 7 noches por el Caribe occidental. Salida desde Galveston, TX. Incluye bebidas ilimitadas.", destination: "Caribe", original_price: 2200, promo_price: 1850, currency: "USD", image_url: "/universal-studios-orlando-wizarding-world.jpg", start_date: "2026-04-01", end_date: "2026-06-30", is_active: true, created_by: "u-002", created_at: "2026-02-05T00:00:00Z", updated_at: "2026-02-05T00:00:00Z" },
  { id: "pr-003", title: "Universal Studios Verano", description: "Paquete 4 días / 3 noches con tickets a Universal Studios y Islands of Adventure. Hotel en zona CityWalk.", destination: "Orlando, FL", original_price: 1400, promo_price: 1199, currency: "USD", image_url: "/universal-studios-orlando-wizarding-world.jpg", start_date: "2026-06-01", end_date: "2026-08-31", is_active: false, created_by: "u-002", created_at: "2026-02-10T00:00:00Z", updated_at: "2026-02-10T00:00:00Z" },
]

// --- Blogs ---

// --- Audit Log ---
export const mockAuditLogs: AuditLog[] = [
  { id: "al-001", user_id: "u-001", user_name: "Administrador", action: "CREATE", entity_type: "user", entity_id: "u-003", details: "Creó usuario Carlos López", created_at: "2025-06-01T10:00:00Z" },
  { id: "al-002", user_id: "u-002", user_name: "María García", action: "CREATE", entity_type: "client", entity_id: "c-001", details: "Creó cliente Juan Pérez", created_at: "2025-06-10T11:30:00Z" },
  { id: "al-003", user_id: "u-002", user_name: "María García", action: "CREATE", entity_type: "commission", entity_id: "cm-001", details: "Registró comisión de Paquete Disney World 5 días", created_at: "2026-01-15T09:00:00Z" },
  { id: "al-004", user_id: "u-001", user_name: "Administrador", action: "UPDATE", entity_type: "user", entity_id: "u-003", details: "Desactivó usuario Carlos López", created_at: "2026-01-10T14:00:00Z" },
  { id: "al-005", user_id: "u-002", user_name: "María García", action: "UPDATE", entity_type: "commission", entity_id: "cm-005", details: "Canceló comisión de vuelos Roberto Sánchez", created_at: "2026-01-05T16:00:00Z" },
  { id: "al-006", user_id: "u-002", user_name: "María García", action: "CREATE", entity_type: "promotion", entity_id: "pr-001", details: "Creó promoción Disney World Primavera 2026", created_at: "2026-02-01T10:00:00Z" },
  { id: "al-007", user_id: "u-002", user_name: "María García", action: "CREATE", entity_type: "blog", entity_id: "b-001", details: "Publicó blog: Los 10 mejores tips para Disney World", created_at: "2026-01-20T12:00:00Z" },
  { id: "al-008", user_id: "u-001", user_name: "Administrador", action: "UPDATE", entity_type: "role", entity_id: "r-002", details: "Actualizó permisos del rol agent", created_at: "2026-02-15T08:00:00Z" },
]
