// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: "CUSTOMER";
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: "CUSTOMER" | "ADMIN" | "GUIDE";
  createdAt: string;
  authProvider: "LOCAL" | "GOOGLE";
}

// Tour types
export interface Tour {
  id_tour: number;
  title: string;
  description: string;
  location: string;
  duration: number;
  price: number;
  max_participants: number;
  start_date: string;
  end_date: string;
  created_at?: string;
  image: string;
}

export interface TourDTO {
  title: string;
  description: string;
  location: string;
  duration: number;
  price: number;
  max_participants: number;
  start_date: string;
  end_date: string;
  image?: string;
}

// Booking types
export interface Booking {
  id: number;
  user_id: number;
  tour_id: number;
  booking_date: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  number_of_people: number;
  total_price: number;
  created_at: string;
}
