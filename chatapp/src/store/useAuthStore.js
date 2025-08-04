// ✅ src/store/useAuthStore.js
import { create } from "zustand";

export const useAuthStore = create((set) => ({
  // ✅ Auth data
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,

  // ✅ Online users list
  onlineUsers: [],

  // ✅ Auth actions
  setAuth: (user, token) => {
    set({ user, token });
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
  },

  logout: () => {
    set({ user: null, token: null, onlineUsers: [] });
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  },

  // ✅ Online users actions
  setOnlineUsers: (users) => set({ onlineUsers: users }),
}));
