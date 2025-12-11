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
  News,
  NewsDTO,
  NewsCategory,
  NewsCategoryDTO,
  PageResponse,
  NewsSearchParams,
  Promotion,
  PromotionDTO,
  PromotionSubscriber,
  PromotionSubscriberDTO,
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

  sendOTP: async (data: RegisterRequest): Promise<string> => {
    const response = await api.post("/customer/auth/register/send-otp", data);
    // Handle both string and object responses
    if (typeof response.data === "string") {
      return response.data;
    }
    if (response.data?.message) {
      return response.data.message;
    }
    return "OTP đã được gửi đến email của bạn";
  },

  verifyOTP: async (email: string, otp: string): Promise<Customer> => {
    const response = await api.post("/customer/auth/register/verify-otp", {
      email,
      otp,
    });
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

  updateProfile: async (data: {
    name: string;
    phone: string;
  }): Promise<Customer> => {
    const response = await api.put("/customer/update", data);
    return response.data;
  },

  changePassword: async (data: {
    oldPassword: string;
    newPassword: string;
  }): Promise<void> => {
    await api.post("/customer/changepassword", data);
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

// News Category API
export const newsCategoryAPI = {
  getAllCategories: async (): Promise<NewsCategory[]> => {
    const response = await api.get("/news-category");
    return Array.isArray(response.data) ? response.data : [];
  },

  getActiveCategories: async (
    active: boolean = true
  ): Promise<NewsCategory[]> => {
    const response = await api.get(`/news-category/active?active=${active}`);
    return Array.isArray(response.data) ? response.data : [];
  },

  getCategoryById: async (id: number): Promise<NewsCategory> => {
    const response = await api.get(`/news-category/${id}`);
    return response.data;
  },

  createCategory: async (data: NewsCategoryDTO): Promise<NewsCategory> => {
    const response = await api.post("/news-category", data);
    return response.data;
  },

  updateCategory: async (data: NewsCategory): Promise<NewsCategory> => {
    const response = await api.put("/news-category", data);
    return response.data;
  },

  deleteCategory: async (id: number): Promise<void> => {
    await api.delete(`/news-category/${id}`);
  },
};

// News API
export const newsAPI = {
  getAllNews: async (): Promise<News[]> => {
    const response = await api.get("/news");
    return Array.isArray(response.data) ? response.data : [];
  },

  getActiveNews: async (active: boolean = true): Promise<News[]> => {
    const response = await api.get(`/news/active?active=${active}`);
    return Array.isArray(response.data) ? response.data : [];
  },

  getNewsByCategory: async (categoryId: number): Promise<News[]> => {
    const response = await api.get(`/news/category/${categoryId}`);
    return Array.isArray(response.data) ? response.data : [];
  },

  getFeaturedNews: async (featured: boolean = true): Promise<News[]> => {
    const response = await api.get(`/news/featured?featured=${featured}`);
    return Array.isArray(response.data) ? response.data : [];
  },

  getNewsById: async (id: number): Promise<News> => {
    const response = await api.get(`/news/${id}`);
    return response.data;
  },

  createNews: async (data: NewsDTO): Promise<News> => {
    const response = await api.post("/news", data);
    return response.data;
  },

  updateNews: async (data: News): Promise<News> => {
    const response = await api.put("/news", data);
    return response.data;
  },

  deleteNews: async (id: number): Promise<void> => {
    await api.delete(`/news/${id}`);
  },

  searchNews: async (
    params: NewsSearchParams = {}
  ): Promise<PageResponse<News>> => {
    const { keyword, categoryId, active, page = 0, size = 10 } = params;

    const queryParams = new URLSearchParams();
    if (keyword) queryParams.append("keyword", keyword);
    if (categoryId !== undefined)
      queryParams.append("categoryId", categoryId.toString());
    if (active !== undefined) queryParams.append("active", active.toString());
    queryParams.append("page", page.toString());
    queryParams.append("size", size.toString());

    const response = await api.get(`/news/search?${queryParams.toString()}`);
    return response.data;
  },

  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/news/upload-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Handle both string and object responses
    if (typeof response.data === "string") {
      return response.data;
    }
    if (response.data?.url) {
      return response.data.url;
    }
    throw new Error("Invalid response format from upload-image");
  },

  createNewsWithImage: async (data: NewsDTO, file: File): Promise<News> => {
    const formData = new FormData();
    formData.append("news", JSON.stringify(data));
    formData.append("file", file);

    const response = await api.post("/news/with-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

// Promotion API
export const promotionAPI = {
  getAllPromotions: async (): Promise<Promotion[]> => {
    const response = await api.get("/promotion");
    return Array.isArray(response.data) ? response.data : [];
  },

  getActivePromotions: async (): Promise<Promotion[]> => {
    const response = await api.get("/promotion/active");
    return Array.isArray(response.data) ? response.data : [];
  },

  getPromotionsByStatus: async (
    active: boolean = true
  ): Promise<Promotion[]> => {
    const response = await api.get(`/promotion/status?active=${active}`);
    return Array.isArray(response.data) ? response.data : [];
  },

  getPromotionByCode: async (code: string): Promise<Promotion> => {
    const response = await api.get(`/promotion/code/${code}`);
    return response.data;
  },

  getPromotionById: async (id: number): Promise<Promotion> => {
    const response = await api.get(`/promotion/${id}`);
    return response.data;
  },

  createPromotion: async (data: PromotionDTO): Promise<Promotion> => {
    const response = await api.post("/promotion", data);
    return response.data;
  },

  updatePromotion: async (data: Promotion): Promise<Promotion> => {
    const response = await api.put("/promotion", data);
    return response.data;
  },

  deletePromotion: async (id: number): Promise<void> => {
    await api.delete(`/promotion/${id}`);
  },
};

// Promotion Subscriber API
export const promotionSubscriberAPI = {
  subscribe: async (
    data: PromotionSubscriberDTO
  ): Promise<PromotionSubscriber> => {
    const response = await api.post("/promotion-subscriber/subscribe", data);
    return response.data;
  },

  unsubscribe: async (email: string): Promise<string> => {
    const response = await api.post("/promotion-subscriber/unsubscribe", {
      email,
    });
    return response.data;
  },

  getAllSubscribers: async (): Promise<PromotionSubscriber[]> => {
    const response = await api.get("/promotion-subscriber");
    return Array.isArray(response.data) ? response.data : [];
  },

  getSubscribersByStatus: async (
    active: boolean = true
  ): Promise<PromotionSubscriber[]> => {
    const response = await api.get(
      `/promotion-subscriber/active?active=${active}`
    );
    return Array.isArray(response.data) ? response.data : [];
  },

  getSubscriberByEmail: async (email: string): Promise<PromotionSubscriber> => {
    const response = await api.get(`/promotion-subscriber/email/${email}`);
    return response.data;
  },

  deleteSubscriber: async (id: number): Promise<void> => {
    await api.delete(`/promotion-subscriber/${id}`);
  },
};

export default api;
