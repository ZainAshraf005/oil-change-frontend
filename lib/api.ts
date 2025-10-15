import axios from "axios";

// Basic API helpers
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function login(email: string, password: string) {
  const res = await axios.post<LoginResponse>(
    `${API_BASE_URL}/user/login`,
    {
      email,
      password,
    },
    { withCredentials: true }
  );
  return res.data;
}

export async function getShops() {
  const res = await axios.get(`${API_BASE_URL}/shop/all`, {
    withCredentials: true,
  });
  return res.data;
}

interface ShopCreate {
  shop: Shop;
  admin: User;
}

export const createShop = async (data: ShopCreate) => {
  const res = await axios.post(`${API_BASE_URL}/shop/create`, data, {
    withCredentials: true,
  });
  return res.data;
};

export async function getShopById(id: string) {
  const res = await axios.get(`${API_BASE_URL}/shop/${id}`, {
    withCredentials: true,
  });
  return res.data;
}

export async function deleteShopById(id: string) {
  const res = await axios.delete(`${API_BASE_URL}/shop/delete/${id}`, {
    withCredentials: true,
  });
  return res.data;
}

export async function updateShop(id: string, payload: ShopCreate) {
  const res = await axios.put(`${API_BASE_URL}/shop/update/${id}`, payload, {
    withCredentials: true,
  });
  return res.data;
}

// ---------------------- PACKAGES ----------------------
export async function createPackage(payload: Package) {
  const res = await axios.post(`${API_BASE_URL}/package/create`, payload, {
    withCredentials: true,
  });
  return res.data;
}

export async function getPackages() {
  const res = await axios.get(`${API_BASE_URL}/package/all`, {
    withCredentials: true,
  });
  return res.data;
}

export async function deletePackageById(id: string) {
  const res = await axios.delete(`${API_BASE_URL}/package/delete/${id}`, {
    withCredentials: true,
  });
  return res.data;
}

export async function updatePackageById(id: string, payload: Package) {
  const res = await axios.put(`${API_BASE_URL}/package/update/${id}`, payload, {
    withCredentials: true,
  });
  return res.data;
}

// ---------------------- PAKAGE ASSIGNMENTS ----------------------
export const assignPackageToShop = async (data: {
  shop_id: number;
  package_id: number;
  start_at: string;
}) => {
  const res = await axios.post(`${API_BASE_URL}/assign-package/assign`, data, {
    withCredentials: true,
  });
  return res.data;
};

export async function deleteAssignmentById(id: string) {
  const res = await axios.delete(
    `${API_BASE_URL}/assign-package/delete/${id}`,
    {
      withCredentials: true,
    }
  );
  return res.data;
}
// ---------------------- Dashboard ----------------------

export async function getDashboardStats() {
  const res = await axios.get(`${API_BASE_URL}/dashboard`, {
    withCredentials: true,
  });
  return res.data;
}

// ---------------------- API CALLING END ----------------------

export interface DashboardStats {
  totalShops: number;
  activePackages: number;
  quotaUsage: number;
  recentShops: Shop[];
}
// Auth
export type LoginRequest = { email: string; password: string };
export type LoginResponse = {
  message?: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: "SUPERADMIN" | "ADMIN";
    shopId?: string | null;
  };
};

export type User = {
  id?: string;
  name: string;
  phone?: string;
  email: string;
  role?: "SUPERADMIN" | "ADMIN";
};

// Super Admin
export type Shop = {
  id?: string | number;
  user_id?: string;
  name: string;
  address?: string;
  created_at?: string; // ISO
  user?: User;
  admin?: User;
  package_assignments?: PackageAssignment | null;
};

export type Package = {
  id?: string | number;
  name: string;
  email_enabled: boolean;
  sms_enabled: boolean;
  whatsapp_enabled: boolean;
  email_limit: number;
  sms_limit: number;
  whatsapp_limit: number;
  createdAt?: string;
  created_at?: string;
};

export type PackageAssignment = {
  id?: number | string;
  start_at: string;
  package: Package;
};

// Admin
export type Product = {
  id: string;
  sku: string;
  name: string;
  unit: "L" | "ML";
  pricePerUnit: number; // price per unit (matches 'unit')
  createdAt: string;
};

export type Customer = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  createdAt: string;
};

export type Vehicle = {
  id: string;
  customerId: string;
  reg: string; // normalized reg preferred
  make?: string;
  model?: string;
  year?: number;
  lastServiceAt?: string;
  nextDueAt?: string;
};

export type Sale = {
  id: string;
  shopId: string;
  customerId: string;
  vehicleId: string;
  productId: string;
  quantityLiters: number;
  pricePerLiter: number;
  total: number;
  soldAt: string;
};

export type Reminder = {
  id: string;
  shopId: string;
  customerId: string;
  vehicleId: string;
  dueAt: string;
  status: "pending" | "sent" | "dismissed";
  createdAt: string;
};

export type AdminSettings = {
  shopId: string;
  shopName: string;
  defaultTimezone: string; // e.g. "Asia/Karachi"
  smsSenderId?: string;
  notificationsEnabled: boolean;
  updatedAt: string;
};

/**
 * ===============================
 * Expected REST Endpoints (Docs)
 * ===============================
 *
 * Auth
 * - POST /auth/login {email, password} -> LoginResponse
 *
 * Super Admin
 * - GET /super-admin/shops -> Shop[]
 * - POST /super-admin/shops {name, email, phone?} -> Shop
 * - GET /super-admin/packages -> Package[]
 * - POST /super-admin/packages {name, description?, pricePerLiter} -> Package
 * - POST /super-admin/shops/:shopId/packages {packageId} -> ShopPackageAssignment
 * - GET /super-admin/shops/:shopId/packages -> Package[] (assigned)
 *
 * Admin
 * - GET /admin/products -> Product[]
 * - POST /admin/products {sku, name, unit, pricePerUnit} -> Product
 * - GET /admin/customers -> Customer[]
 * - POST /admin/customers {name, phone?, email?} -> Customer
 * - GET /admin/vehicles?customerId= -> Vehicle[]
 * - POST /admin/vehicles {customerId, reg, make?, model?, year?} -> Vehicle
 * - GET /admin/sales -> Sale[]
 * - POST /admin/sales {...} -> Sale
 * - GET /admin/reminders -> Reminder[]
 * - POST /admin/reminders {customerId, vehicleId, dueAt} -> Reminder
 * - GET /admin/settings -> AdminSettings
 * - PUT /admin/settings {...} -> AdminSettings
 */

/**
 * ===============================
 * Dummy Data (use for UI scaffolding/testing)
 * ===============================
 */
const now = new Date();
const iso = (d: Date) => d.toISOString();

export const DUMMY_PRODUCTS: Product[] = [
  {
    id: "p_10w40",
    sku: "10W40-1L",
    name: "10W-40 Mineral 1L",
    unit: "L",
    pricePerUnit: 3.0,
    createdAt: iso(now),
  },
  {
    id: "p_5w30",
    sku: "5W30-1L",
    name: "5W-30 Synthetic 1L",
    unit: "L",
    pricePerUnit: 4.8,
    createdAt: iso(now),
  },
];

export const DUMMY_CUSTOMERS: Customer[] = [
  {
    id: "c_ali",
    name: "Ali Khan",
    phone: "+92 300 2222222",
    createdAt: iso(now),
  },
  {
    id: "c_sana",
    name: "Sana Ahmed",
    phone: "+92 300 3333333",
    createdAt: iso(now),
  },
];

export const DUMMY_VEHICLES: Vehicle[] = [
  {
    id: "v_ali_civic",
    customerId: "c_ali",
    reg: "ABC-1234",
    make: "Honda",
    model: "Civic",
    year: 2018,
    lastServiceAt: iso(now),
    nextDueAt: iso(new Date(now.getTime() + 90 * 86400000)),
  },
  {
    id: "v_sana_corolla",
    customerId: "c_sana",
    reg: "XYZ-9876",
    make: "Toyota",
    model: "Corolla",
    year: 2020,
    lastServiceAt: iso(now),
    nextDueAt: iso(new Date(now.getTime() + 120 * 86400000)),
  },
];

export const DUMMY_SALES: Sale[] = [
  {
    id: "sale_1",
    shopId: "s_karachi_1",
    customerId: "c_ali",
    vehicleId: "v_ali_civic",
    productId: "p_10w40",
    quantityLiters: 3.5,
    pricePerLiter: 3.0,
    total: 10.5,
    soldAt: iso(now),
  },
];

export const DUMMY_REMINDERS: Reminder[] = [
  {
    id: "rem_1",
    shopId: "s_karachi_1",
    customerId: "c_ali",
    vehicleId: "v_ali_civic",
    dueAt: iso(new Date(now.getTime() + 85 * 86400000)),
    status: "pending",
    createdAt: iso(now),
  },
];

export const DUMMY_SETTINGS: AdminSettings = {
  shopId: "s_karachi_1",
  shopName: "Karachi Oil & Lube",
  defaultTimezone: "Asia/Karachi",
  smsSenderId: "KOL",
  notificationsEnabled: true,
  updatedAt: iso(now),
};

/**
 * Example usage in components (client):
 * const shops = await apiGet<Shop[]>("/super-admin/shops")
 * const sale = await apiPost<Sale>("/admin/sales", body)
 */
