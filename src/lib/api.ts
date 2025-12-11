// API Configuration for Hall Booking System
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://10.70.9.131:8000';

// Types
export interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
}

export interface Admin {
  id: number;
  email: string;
  name: string;
}

export interface Hall {
  id: number;
  name: string;
  description: string;
  capacity: number;
  price_per_hour: number;
  price_per_day: number;
  location: string;
  images?: HallImage[];
  amenities?: Amenity[];
}

export interface HallImage {
  id: number;
  hall_id: number;
  image_url: string;
}

export interface Amenity {
  id: number;
  name: string;
  icon?: string;
}

export interface Booking {
  id: number;
  hall_id: number;
  user_id: number;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  total_amount: number;
  payment_status: 'pending' | 'completed' | 'failed';
  hall?: Hall;
}

export interface TimeSlot {
  start_time: string;
  end_time: string;
  available: boolean;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user?: User;
  admin?: Admin;
}

// Helper function for API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(error.detail || 'Request failed');
  }

  return response.json();
}

// Auth API
export const authApi = {
  userRegister: (data: { email: string; password: string; name: string; phone?: string }) =>
    apiCall<AuthResponse>('/auth/user/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  userLogin: (data: { email: string; password: string }) =>
    apiCall<AuthResponse>('/auth/user/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  adminRegister: (data: { email: string; password: string; name: string }) =>
    apiCall<AuthResponse>('/auth/admin/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  adminLogin: (data: { email: string; password: string }) =>
    apiCall<AuthResponse>('/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Halls API
export const hallsApi = {
  getAll: () => apiCall<Hall[]>('/halls/'),
  getById: (id: number) => apiCall<Hall>(`/halls/${id}`),
  create: (data: Partial<Hall>) =>
    apiCall<Hall>('/halls/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: number, data: Partial<Hall>) =>
    apiCall<Hall>(`/halls/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    apiCall<void>(`/halls/${id}`, { method: 'DELETE' }),
};

// Amenities API
export const amenitiesApi = {
  getAll: () => apiCall<Amenity[]>('/amenities/'),
  getByHall: (hallId: number) => apiCall<Amenity[]>(`/amenities/hall/${hallId}`),
  create: (data: { name: string; icon?: string }) =>
    apiCall<Amenity>('/amenities/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  assignToHall: (hallId: number, amenityIds: number[]) =>
    apiCall<void>(`/amenities/assign/${hallId}`, {
      method: 'POST',
      body: JSON.stringify({ amenity_ids: amenityIds }),
    }),
};

// Hall Images API
export const hallImagesApi = {
  getByHall: (hallId: number) => apiCall<HallImage[]>(`/hall-images/${hallId}`),
  upload: (hallId: number, formData: FormData) =>
    fetch(`${API_BASE_URL}/hall-images/${hallId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    }).then((res) => res.json()),
  delete: (imageId: number) =>
    apiCall<void>(`/hall-images/${imageId}`, { method: 'DELETE' }),
};

// Bookings API
export const bookingsApi = {
  create: (data: {
    hall_id: number;
    booking_date: string;
    start_time: string;
    end_time: string;
  }) =>
    apiCall<Booking>('/bookings/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  verifyPayment: (data: { booking_id: number; payment_id: string; signature: string }) =>
    apiCall<Booking>('/bookings/verify-payment', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getMyBookings: () => apiCall<Booking[]>('/bookings/my'),
  cancel: (bookingId: number) =>
    apiCall<void>(`/bookings/${bookingId}`, { method: 'DELETE' }),
  getByHallAdmin: (hallId: number) =>
    apiCall<Booking[]>(`/bookings/admin/hall/${hallId}`),
  getAvailableDates: (hallId: number) =>
    apiCall<string[]>(`/bookings/hall/${hallId}/available-dates`),
  getAvailableSlots: (hallId: number, date: string) =>
    apiCall<TimeSlot[]>(`/bookings/hall/${hallId}/available-slots?date=${date}`),
  getCalendar: () => apiCall<Booking[]>('/bookings/calendar'),
};

// Admin Panel API
export const adminPanelApi = {
  getUsers: () => apiCall<User[]>('/admin-panel/users'),
  getAdmins: () => apiCall<Admin[]>('/admin-panel/admins'),
  getHalls: () => apiCall<Hall[]>('/admin-panel/halls'),
};

// Admin Analytics API
export const adminAnalyticsApi = {
  getTotalRevenue: () => apiCall<{ total: number }>('/admin-analytics/revenue/total'),
  getMonthlyRevenue: (year: number) =>
    apiCall<{ month: number; revenue: number }[]>(`/admin-analytics/revenue/monthly?year=${year}`),
  getRevenueByHalls: () =>
    apiCall<{ hall_id: number; hall_name: string; revenue: number }[]>('/admin-analytics/revenue/halls'),
  getBookingsByHall: () =>
    apiCall<{ hall_id: number; hall_name: string; count: number }[]>('/admin-analytics/bookings/hall-count'),
  getPaymentStats: () =>
    apiCall<{ total_payments: number; completed: number; pending: number; failed: number }>('/admin-analytics/payments/stats'),
};
