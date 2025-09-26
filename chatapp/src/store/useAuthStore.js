import { create } from "zustand";
import api from "../utils/axiosInstance";

import { showToast } from "../components/utils/showToast";
export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  loading: false,
  onlineUsers: [],
  

  setAuth: (user, token) => {
    // ✅ Always normalize username for UI use
    const normalizedUser = {
      ...user,
      username: user?.username?.trim() || "User",
    };

    set({ user: normalizedUser, token, loading: false });
    localStorage.setItem("user", JSON.stringify(normalizedUser));
    localStorage.setItem("token", token);
  },

  checkAuth: async () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  set({ loading: true });
  try {
    const { data } = await api.get("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    // 🔹 Merge with existing user to preserve avatar if missing
    const existingUser = JSON.parse(localStorage.getItem("user")) || {};
    const normalizedUser = {
      ...existingUser,
      ...data,
      username: data?.username?.trim() || existingUser.username || "User",
      avatar: data?.avatar || existingUser.avatar || null,
    };

    set({ user: normalizedUser, token, loading: false });
    localStorage.setItem("user", JSON.stringify(normalizedUser));
    showToast("Session restored 😊", false);
  } catch (err) {
    set({ user: null, token: null, loading: false });
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    showToast("Session expired, please log in ❌", true);
  }
},


  login: async ({ email, password }) => {
    try {
      set({ loading: true });
      const { data } = await api.post("/auth/login", { email, password });

      const normalizedUser = {
        ...data.user,
        username: data.user?.username?.trim() || "User",
      };

      set({ user: normalizedUser, token: data.token, loading: false });
      localStorage.setItem("user", JSON.stringify(normalizedUser));
      localStorage.setItem("token", data.token);
      showToast(`Welcome back ${normalizedUser.username} 👋`, false);
    } catch (err) {
      set({ loading: false });
      showToast(err.response?.data?.msg || "Login failed!", true);
      throw err;
    }
  },

  logout: () => {
    set({ user: null, token: null, loading: false, onlineUsers: [] });
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    showToast("Logged out succesfully", false, { icon: "👋" });
  },

  setOnlineUsers: (users) => set({ onlineUsers: users }),
}));
