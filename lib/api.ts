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
export async function getAdminDashboardStats(shopId: string) {
  const res = await axios.get(`${API_BASE_URL}/dashboard/admin/${shopId}`, {
    withCredentials: true,
  });
  return res.data;
}
// ---------------------- Product ----------------------
export async function getAllProducts(id: string) {
  const res = await axios.get(`${API_BASE_URL}/product/all/${id}`, {
    withCredentials: true,
  });
  return res.data;
}
export async function getProductById(id: string) {
  const res = await axios.get(`${API_BASE_URL}/product/${id}`, {
    withCredentials: true,
  });
  return res.data;
}
export async function createProduct(payload: CreateProductReq) {
  const res = await axios.post(`${API_BASE_URL}/product/create`, payload, {
    withCredentials: true,
  });
  return res.data;
}
export async function updateProduct(payload: CreateProductReq, id: string) {
  const res = await axios.put(`${API_BASE_URL}/product/update/${id}`, payload, {
    withCredentials: true,
  });
  return res.data;
}
export async function deleteProduct(id: string) {
  const res = await axios.delete(`${API_BASE_URL}/product/delete/${id}`, {
    withCredentials: true,
  });
  return res.data;
}
// ---------------------- Customer ----------------------

export async function getAllCustomers(id: string) {
  const res = await axios.get(`${API_BASE_URL}/customer/all/${id}`, {
    withCredentials: true,
  });
  return res.data;
}
export async function getCustomerById(id: string) {
  const res = await axios.get(`${API_BASE_URL}/customer/${id}`, {
    withCredentials: true,
  });
  return res.data;
}
export async function createCustomer(payload: CreateCustomerReq) {
  const res = await axios.post(`${API_BASE_URL}/customer/create`, payload, {
    withCredentials: true,
  });
  return res.data;
}

export async function updateCustomer(payload: CreateCustomerReq, id: string) {
  const res = await axios.put(
    `${API_BASE_URL}/customer/update/${id}`,
    payload,
    {
      withCredentials: true,
    }
  );
  return res.data;
}
export async function deleteCustomer(id: string) {
  const res = await axios.delete(`${API_BASE_URL}/customer/delete/${id}`, {
    withCredentials: true,
  });
  return res.data;
}
// ---------------------- Vehicle ----------------------

export async function getAllVehicles(id: string) {
  const res = await axios.get(`${API_BASE_URL}/vehicle/all/${id}`, {
    withCredentials: true,
  });
  return res.data;
}
export async function getAllVehiclesByCustomerId(id: string) {
  const res = await axios.get(`${API_BASE_URL}/vehicle/customer/${id}`, {
    withCredentials: true,
  });
  return res.data;
}
export async function getVehicleById(id: string) {
  const res = await axios.get(`${API_BASE_URL}/vehicle/${id}`, {
    withCredentials: true,
  });
  return res.data;
}
export async function createVehicle(payload: CreateVehicleReq) {
  const res = await axios.post(`${API_BASE_URL}/vehicle/create`, payload, {
    withCredentials: true,
  });
  return res.data;
}

export async function updateVehicle(payload: CreateVehicleReq, id: string) {
  const res = await axios.put(`${API_BASE_URL}/vehicle/update/${id}`, payload, {
    withCredentials: true,
  });
  return res.data;
}
export async function deleteVehicle(id: string) {
  const res = await axios.delete(`${API_BASE_URL}/vehicle/delete/${id}`, {
    withCredentials: true,
  });
  return res.data;
}
// ---------------------- Sales ----------------------

export async function createSale(payload: CreateSaleReq) {
  const res = await axios.post(`${API_BASE_URL}/sale/create`, payload, {
    withCredentials: true,
  });
  return res.data;
}

export async function getAllSales(id: string) {
  const res = await axios.get(`${API_BASE_URL}/sale/shop/${id}`, {
    withCredentials: true,
  });
  return res.data;
}
export async function getAllSalesByVehicleId(id: string) {
  const res = await axios.get(`${API_BASE_URL}/sale/vehicle/${id}`, {
    withCredentials: true,
  });
  return res.data;
}

export async function deleteSale(id: string) {
  const res = await axios.delete(`${API_BASE_URL}/sale/${id}`, {
    withCredentials: true,
  });
  return res.data;
}
export async function deleteAllSalesByVehicleId(id: string) {
  const res = await axios.delete(`${API_BASE_URL}/sale/all/${id}`, {
    withCredentials: true,
  });
  return res.data;
}

// ---------------------- Reminders ----------------------

export async function getAllRemindersByShopId(shopId: string) {
  const res = await axios.get(`${API_BASE_URL}/reminder/shop/${shopId}`, {
    withCredentials: true,
  });
  return res.data;
}

export async function getAllRemindersByVehicleId(vehicleId: string) {
  const res = await axios.get(`${API_BASE_URL}/reminder/vehicle/${vehicleId}`, {
    withCredentials: true,
  });
  return res.data;
}

export async function getAllRemindersByCustomerId(customerId: string) {
  const res = await axios.get(
    `${API_BASE_URL}/reminder/customer/${customerId}`,
    {
      withCredentials: true,
    }
  );
  return res.data;
}

export async function deleteReminder(id: string) {
  const res = await axios.delete(`${API_BASE_URL}/reminder/${id}`, {
    withCredentials: true,
  });
  return res.data;
}
// ---------------------- Sales ----------------------

export async function getQuota() {
  const res = await axios.get(`${API_BASE_URL}/quota/`, {
    withCredentials: true,
  });
  return res.data;
}

export async function updateQuota(payload: UpdateQuotaReq, id: string) {
  const res = await axios.put(`${API_BASE_URL}/quota/update/${id}`, payload, {
    withCredentials: true,
  });
  return res.data;
}
// ---------------------- Settings ----------------------
export async function updatePassword(payload: UpdatePasswordReq) {
  const res = await axios.post(
    `${API_BASE_URL}/settings/update-password`,
    payload,
    {
      withCredentials: true,
    }
  );
  return res.data;
}
export async function updateProfile(payload: UpdateProfileReq) {
  const res = await axios.put(
    `${API_BASE_URL}/settings/update-business-profile`,
    payload,
    {
      withCredentials: true,
    }
  );
  return res.data;
}
export async function updateNotifications(
  payload: UpdateNotificationsReq,
  id: string
) {
  const res = await axios.put(
    `${API_BASE_URL}/settings/notification-settings/${id}`,
    payload,
    {
      withCredentials: true,
    }
  );
  return res.data;
}
export async function updateShopStatus(shopId: string, newStatus: string) {
  const res = await axios.put(
    `${API_BASE_URL}/settings/update-status`,
    { shopId, newStatus },
    {
      withCredentials: true,
    }
  );
  return res.data;
}

// ---------------------- API CALLING END ----------------------

export interface UpdateNotificationsReq {
  low_stock: boolean;
  whatsapp: boolean;
  email: boolean;
  sms: boolean;
}
export interface UpdateProfileReq {
  shop_name: string;
  shop_address: string;
  shop_id: string | number;
  user_phone: string | number;
}
export interface UpdatePasswordReq {
  newPassword: string;
  currentPassword: string;
  userId: string | number;
}

// Mock data structure for getSuperAdminStats
export interface SuperAdminStats {
  totalShops: number;
  activePackages: number;
  totalRevenue: number;
  quotaUsage: number;
  recentShops: Array<{
    id: number;
    name: string;
    createdAt: string;
  }>;
  channelUsage: {
    email: { used: number; limit: number };
    sms: { used: number; limit: number };
    whatsapp: { used: number; limit: number };
  };
  salesTrend: Array<{
    date: string;
    sales: number;
    revenue: number;
  }>;
  topShops: Array<{
    id: number;
    name: string;
    sales: number;
    revenue: number;
  }>;
  reminderStats: {
    sent: number;
    failed: number;
    queued: number;
  };
}

// Mock data

// Simulated API call with delay
export async function getSuperAdminStats(): Promise<{
  data: SuperAdminStats;
  success: boolean;
}> {
  // Simulate network delay
  const res = await axios.get(`${API_BASE_URL}/super-admin/`, {
    withCredentials: true,
  });
  return res.data;
}

export interface UpdateQuotaReq {
  emailLimit: number;
  smsLimit: number;
  whatsappLimit: number;
  resetPeriod: string;
}

export interface CreateSaleReq {
  vehicle_id: string | number;
  product_id: string | number;
  shop_id: string | number;
  odometer_km: number;
  quantity_liters: number;
  price_per_liter: number;
  total_amount: number;
  payment_method: "CASH" | "CARD" | "OTHER";
  notes?: string;
  reminder_days: number;
}
export interface CreateVehicleReq {
  shop_id: string | number;
  owner_id: string | number;
  registration_number: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
}
export interface CreateCustomerReq {
  shop_id?: string | number;
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
}
export interface CreateProductReq {
  shop_id?: string | number;
  name: string;
  price_per_litre: number;
  stock_litres: number;
  low_stock_threshold: number;
}

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
    phone: string;
    role: "SUPERADMIN" | "ADMIN";
    shop: Shop;
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
  status?: "ACTIVE" | "SUSPENDED";
  created_at?: string; // ISO
  user?: User;
  admin?: User;
  package_assignment?: PackageAssignment | null;
  channel_usage?: channelUsage;
  settings?: Setting;
};

type Setting = {
  id?: string | number;
  shop_id: string | number;
  low_stock_notifications: boolean;
  default_reminder_channels: {
    email: boolean;
    whatsapp: boolean;
    sms: boolean;
  };
  message_template: JSON;
  timezone?: string;
  created_at: Date | string;
};

export type channelUsage = {
  id?: string | number;
  shop_id: string | number;
  emailLimit: number;
  smsLimit: number;
  whatsappLimit: number;
  emailUsed: number;
  smsUsed: number;
  whatsappUsed: number;
  resetPeriod: string;
  created_at?: string | Date;
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
  id?: string | number;
  shop_id: string | number;
  name: string;
  price_per_litre: number;
  stock_litres: number;
  low_stock_threshold: number;
  created_at: string;
  shop?: Shop;
};

export type Customer = {
  id: string;
  name: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  createdAt?: string;
  created_at?: string | Date;
};

export type Vehicle = {
  id?: string | number;
  shop_id: string | number;
  owner_id: string | number;
  registration_number: string; // normalized reg preferred
  make?: string;
  model?: string;
  year?: number;
  mileage: number;
  created_at?: string;
  shop?: Shop;
  owner?: Customer;
  sales?: Sale[];
  reminders?: Reminder[];
};

export type Sale = {
  id?: string | number;
  shop_id: string;
  product_id: string;
  vehicle_id: string;
  odometer_km: number;
  quantity_liters: number;
  price_per_liter: number;
  total_amount: number;
  payment_method: string;
  notes?: string;
  is_reminder: boolean;
  created_at?: string | Date;
  reminder?: Reminder;
  vehicle?: Vehicle;
  product?: Product;
};

export type Reminder = {
  id?: string | number;
  shop_id: string | number;
  owner_id: string | number;
  vehicle_id: string | number;
  sale_id: string | number;
  due_date?: string | Date;
  reminder_days: number;
  created_at: string;
  channelStatuses: ReminderChannelStatus[];
  sale?: Sale;
  vehicle?: Vehicle;
  owner?: Customer;
  shop?: Shop;
};

type ReminderChannelStatus = {
  id: string | number;
  reminder_id: string | number;
  channel: "WHATSAPP" | "SMS" | "EMAIL";
  status: "QUEUED" | "SENT" | "FAILED";
  error?: string;
  sent_at?: Date | string;
};

export type AdminSettings = {
  shopId: string;
  shopName: string;
  defaultTimezone: string; // e.g. "Asia/Karachi"
  smsSenderId?: string;
  notificationsEnabled: boolean;
  updatedAt: string;
};


