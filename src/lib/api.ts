import axios from "axios";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  Customer,
  Tour,
  Booking,
  TourDTO,
  Info,
  InfoDTO,
  Contact,
  ContactDTO,
} from "@/types";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post("/customer/auth/login", data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<Customer> => {
    const response = await api.post("/customer/auth/register", data);
    return response.data;
  },

  getProfile: async (): Promise<Customer> => {
    const response = await api.get("/customer/profile");
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await api.post("/customer/auth/refresh-token", {
      refreshToken,
    });
    return response.data;
  },
};

// Tour API
export const tourAPI = {
  getAllTours: async (): Promise<Tour[]> => {
    const response = await api.get("/tours");
    return Array.isArray(response.data) ? response.data : [];
  },

  getTourById: async (id: number): Promise<Tour> => {
    const response = await api.get(`/tour/${id}`);
    return response.data;
  },

  getToursByLocation: async (location: string): Promise<Tour[]> => {
    const response = await api.get(`/tours/location/${location}`);
    return Array.isArray(response.data) ? response.data : [];
  },

  getToursByTitle: async (title: string): Promise<Tour[]> => {
    const response = await api.get(`/tours/title/${title}`);
    return Array.isArray(response.data) ? response.data : [];
  },

  getToursByPriceRange: async (
    minPrice: number,
    maxPrice: number
  ): Promise<Tour[]> => {
    const response = await api.get(
      `/tours/price?minPrice=${minPrice}&maxPrice=${maxPrice}`
    );
    return Array.isArray(response.data) ? response.data : [];
  },

  createTour: async (data: TourDTO): Promise<Tour> => {
    const response = await api.post("/tour", data);
    return response.data;
  },

  updateTour: async (data: Tour): Promise<Tour> => {
    const response = await api.put("/tour", data);
    return response.data;
  },

  deleteTour: async (id: number): Promise<void> => {
    await api.delete(`/tour/${id}`);
  },
};

// Booking API
export const bookingAPI = {
  createBooking: async (
    data: Omit<Booking, "id" | "created_at">
  ): Promise<Booking> => {
    const response = await api.post("/booking", data);
    return response.data;
  },

  getBookingsByUserId: async (userId: number): Promise<Booking[]> => {
    const response = await api.get(`/booking/user/${userId}`);
    return Array.isArray(response.data) ? response.data : [];
  },

  getBookingById: async (id: number): Promise<Booking> => {
    const response = await api.get(`/booking/${id}`);
    return response.data;
  },

  getAllBookings: async (): Promise<Booking[]> => {
    const response = await api.get("/bookings");
    return Array.isArray(response.data) ? response.data : [];
  },
};

// Info/About API
export const infoAPI = {
  getAllInfo: async (): Promise<Info[]> => {
    const response = await api.get("/about/info");
    return Array.isArray(response.data) ? response.data : [];
  },

  getOrderedInfo: async (): Promise<Info[]> => {
    const response = await api.get("/about/info/ordered");
    return Array.isArray(response.data) ? response.data : [];
  },

  getContactInfo: async (isContactInfo: boolean = true): Promise<Info[]> => {
    const response = await api.get(
      `/about/info/contact?isContactInfo=${isContactInfo}`
    );
    return Array.isArray(response.data) ? response.data : [];
  },

  getInfoById: async (id: number): Promise<Info> => {
    const response = await api.get(`/about/info/${id}`);
    return response.data;
  },

  createInfo: async (data: InfoDTO): Promise<Info> => {
    const response = await api.post("/about/info", data);
    return response.data;
  },

  updateInfo: async (data: Info): Promise<Info> => {
    const response = await api.put("/about/info", data);
    return response.data;
  },

  deleteInfo: async (id: number): Promise<void> => {
    await api.delete(`/about/info/${id}`);
  },
};

// Contact API
export const contactAPI = {
  getAllContacts: async (): Promise<Contact[]> => {
    const response = await api.get("/contact");
    return Array.isArray(response.data) ? response.data : [];
  },

  getActiveContacts: async (active: boolean = true): Promise<Contact[]> => {
    const response = await api.get(`/contact/active?active=${active}`);
    return Array.isArray(response.data) ? response.data : [];
  },

  getContactById: async (id: number): Promise<Contact> => {
    const response = await api.get(`/contact/${id}`);
    return response.data;
  },

  createContact: async (data: ContactDTO): Promise<Contact> => {
    const response = await api.post("/contact", { ...data, active: true });
    return response.data;
  },

  updateContact: async (data: Contact): Promise<Contact> => {
    const response = await api.put("/contact", data);
    return response.data;
  },

  deleteContact: async (id: number): Promise<void> => {
    await api.delete(`/contact/${id}`);
  },
};

export default api;
