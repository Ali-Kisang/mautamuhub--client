import { create } from "zustand";

export const useChatStore = create((set, get) => ({
  unreadCounts: {},
  totalUnread: 0,
  activeChatId: null, // ✅ Track open chat

  setUnreadCounts: (counts) =>
    set(() => {
      const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
      return { unreadCounts: counts, totalUnread: total };
    }),

  // Add +1 unread to a specific user (only if chat not active)
  incrementUnread: (userId) =>
    set((state) => {
      if (state.activeChatId === userId) return state; // ✅ Skip if chat open
      const updated = {
        ...state.unreadCounts,
        [userId]: (state.unreadCounts[userId] || 0) + 1,
      };
      const total = Object.values(updated).reduce((sum, n) => sum + n, 0);
      return { unreadCounts: updated, totalUnread: total };
    }),

  // Clear unread messages for a specific user (when conversation is opened/read)
  clearUnreadForUser: (userId) =>
    set((state) => {
      const updated = { ...state.unreadCounts, [userId]: 0 };
      const total = Object.values(updated).reduce((sum, n) => sum + n, 0);
      return { unreadCounts: updated, totalUnread: total, activeChatId: userId }; // ✅ Set active
    }),

  // Set active chat (e.g., on open/close)
  setActiveChat: (chatId) => set({ activeChatId: chatId }),

  // ✅ Clear all unread messages (optional, e.g. after logout)
  clearAllUnread: () =>
    set(() => ({
      unreadCounts: {},
      totalUnread: 0,
      activeChatId: null,
    })),
}));