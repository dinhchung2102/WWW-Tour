import axios from "axios";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  Customer,
  Tour,
  Booking,
} from "@/types";

const API_BASE_URL = "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE_URL,
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
    return response.data;
  },

  getTourById: async (id: number): Promise<Tour> => {
    const response = await api.get(`/tour/${id}`);
    return response.data;
  },

  getToursByLocation: async (location: string): Promise<Tour[]> => {
    const response = await api.get(`/tours/location/${location}`);
    return response.data;
  },

  getToursByTitle: async (title: string): Promise<Tour[]> => {
    const response = await api.get(`/tours/title/${title}`);
    return response.data;
  },

  getToursByPriceRange: async (
    minPrice: number,
    maxPrice: number
  ): Promise<Tour[]> => {
    const response = await api.get(
      `/tours/price?minPrice=${minPrice}&maxPrice=${maxPrice}`
    );
    return response.data;
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
    return response.data;
  },

  getBookingById: async (id: number): Promise<Booking> => {
    const response = await api.get(`/booking/${id}`);
    return response.data;
  },
};

export default api;
