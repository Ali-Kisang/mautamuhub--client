// src/store/useChatStore.js
import { create } from "zustand";
import api from "../utils/axiosInstance"; // For fetch

export const useChatStore = create((set, get) => ({
  activeChat: null,
  unreadCounts: {},

  setActiveChat: (chatId) => set({ activeChat: chatId }),

  // ✅ Added: Direct setter for unread counts (used in NavBar)
  setUnreadCounts: (counts) => set({ unreadCounts: counts || {} }),

  incrementUnread: (senderId, increment = 1) =>
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [senderId]: (state.unreadCounts[senderId] || 0) + increment,
      },
    })),

  // ✅ Add this if missing
  resetUnread: (senderId) =>
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [senderId]: 0,
      },
    })),

  clearUnreadForUser: (userId) => get().resetUnread(userId), // Alias for list

  fetchUnreadCounts: async () => {
    try {
      const { data } = await api.get("/chat/unread-by-user");
      const counts = data.reduce((acc, { _id: id, count }) => ({ ...acc, [id]: count }), {});
      get().setUnreadCounts(counts); // Use the new setter internally
    } catch (err) {
      console.error("Fetch unread failed:", err);
    }
  },

  getTotalUnread: () => Object.values(get().unreadCounts).reduce((sum, count) => sum + (Number(count) || 0), 0),

  // ✅ New: Fetch recent convos (for Messenger list)
  fetchRecentConversations: async () => {
    try {
      const { data } = await api.get("/chat/recent");
      // Sync unreads from convos
      const updatedCounts = data.reduce((acc, convo) => ({ ...acc, [convo.userId]: convo.unreadCount || 0 }), {});
      get().setUnreadCounts(updatedCounts); // Use the new setter
    } catch (err) {
      console.error("Fetch recent failed:", err);
    }
  },
}));