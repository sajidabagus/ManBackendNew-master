"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { loginApi, logoutApi, meApi } from "@/lib/api/auth";
import { clearAuthToken, getAuthToken, setAuthToken } from "@/lib/auth-token";
import type { ApiUser } from "@/types/api";

interface AuthState {
  user: ApiUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string,
    captchaId: string,
    captchaAnswer: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: (silent?: boolean) => Promise<void>;
  setAuth: (token: string, user: ApiUser) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      setAuth: (token, user) => {
        setAuthToken(token);
        set({ token, user, isAuthenticated: true });
      },

      clearAuth: () => {
        clearAuthToken();
        set({ token: null, user: null, isAuthenticated: false });
      },

      login: async (email, password, captchaId, captchaAnswer) => {
        set({ isLoading: true });
        try {
          const data = await loginApi(
            email,
            password,
            captchaId,
            captchaAnswer,
          );
          const token = data.token;
          const user = data.user;

          if (!token || !user) {
            throw new Error("Respons login tidak valid.");
          }

          get().setAuth(token, user);
          set({ isLoading: false });
        } catch (e) {
          set({ isLoading: false });
          throw e;
        }
      },

      logout: async () => {
        try {
          if (getAuthToken()) await logoutApi();
        } finally {
          get().clearAuth();
        }
      },

      fetchUser: async (silent = false) => {
        const token = getAuthToken() ?? get().token;
        if (!token) {
          throw new Error("No token");
        }
        setAuthToken(token);
        if (!silent) {
          set({ isLoading: true, token });
        } else {
          set({ token });
        }
        try {
          const user = await meApi();
          set({ user, token, isAuthenticated: true, isLoading: false });
        } catch (e) {
          get().clearAuth();
          set({ isLoading: false });
          throw e;
        }
      },
    }),
    {
      name: "man2-admin-auth",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
