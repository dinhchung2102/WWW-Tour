import { create } from "zustand";
import type { Customer } from "@/types";
import { authAPI } from "@/lib/api";

interface AuthState {
  user: Customer | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,

  initialize: () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    if (accessToken && refreshToken) {
      set({ accessToken, refreshToken, isAuthenticated: true });
      get().fetchProfile();
    }
  },

  login: async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      set({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        isAuthenticated: true,
      });
      await get().fetchProfile();
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },

  fetchProfile: async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        set({ user: null, isAuthenticated: false });
        return;
      }

      const user = await authAPI.getProfile();
      set({ user, isAuthenticated: true });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
      });
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  },
}));
