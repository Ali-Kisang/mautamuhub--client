import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware"; 
import api from "../utils/axiosInstance";
import { socket } from "../utils/socket"; 

import { showToast } from "../components/utils/showToast";
import { registerSW } from "../utils/registerSW";

export const useAuthStore = create(
  subscribeWithSelector( // Optional: For reactive updates
    (set, get) => ({
      user: JSON.parse(localStorage.getItem("user")) || null,
      token: localStorage.getItem("token") || null,
      loading: false,
      onlineUsers: [],

      setAuth: (user, token) => {
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
          showToast("Session restored ", false);

          // ✅ Register SW and subscribe on session restore (if granted)
          await get().initPushNotifications();
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

          // ✅ Register SW and prompt/subscribe on login
          await get().initPushNotifications();

          return normalizedUser; 
        } catch (err) {
          set({ loading: false });
          showToast(err.response?.data?.msg || "Login failed!", true);
          throw err;
        }
      },

     
      forgotPassword: async ({ email }) => {
  try {
    await api.post("/users/forgot-password", { email });
    showToast("Password reset email sent! Check your inbox.", false);
  } catch (err) {
   
    
    const status = err.response?.status;
    const backendMessage = err.response?.data?.message || 'Failed to send reset email. Please try again.';
    
    if (status === 200) {
      
      showToast("If the email exists, a reset link has been sent.", false);
    } else if (status === 404) {
      
      showToast(backendMessage, true); 
    } else {
     
      showToast(backendMessage, true);
    }
    
    throw err; 
  }
},

      // ✅ New: Reset Password (public endpoint, validates token server-side)
      resetPassword: async ({ token, newPassword }) => {
        try {
          if (newPassword.length < 6) {
            showToast("Password must be at least 6 characters.", true);
          }
          await api.post("/users/reset-password", { token, newPassword });
          showToast("Password reset successful! You can now log in.", false);
        } catch (err) {
          showToast(err.response?.data?.message || "Failed to reset password. The link may be invalid or expired.", true);
          throw err;
        }
      },

      register: async ({ username, email, password }) => {
        try {
          set({ loading: true });
          const { data } = await api.post("/auth/register", { username, email, password });

          const normalizedUser = {
            ...data.user,
            username: data.user?.username?.trim() || "User",
          };

          set({ user: normalizedUser, token: data.token, loading: false });
          localStorage.setItem("user", JSON.stringify(normalizedUser));
          localStorage.setItem("token", data.token);
          showToast(`Welcome ${normalizedUser.username}! Account created 👋`, false);

          // ✅ Register SW and prompt/subscribe on register
          await get().initPushNotifications();

          return normalizedUser;
        } catch (err) {
          set({ loading: false });
          showToast(err.response?.data?.msg || "Registration failed!", true);
          throw err;
        }
      },

      logout: () => {
        set({ user: null, token: null, loading: false, onlineUsers: [] });
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        showToast("Logged out successfully", false, { icon: "👋" });
      },
      
      setOnlineUsers: (users) => {
        set({ onlineUsers: users });
        console.log("Store updated onlineUsers:", users.length); 
      },

      // ✅ New: Init push notifications (perm + sub)
      initPushNotifications: async () => {
        try {
          await registerSW(); 

          if (Notification.permission === 'default') {
            const perm = await Notification.requestPermission();
            if (perm === 'granted') {
              await get().subscribeToPush();
              showToast("Notifications enabled! 🔔", false);
            } else {
              showToast("Notifications blocked—enable in browser settings", true);
            }
          } else if (Notification.permission === 'granted') {
            await get().subscribeToPush();
          }
        } catch (err) {
          console.error("Push init failed:", err);
        }
      },

      // ✅ New: Subscribe to push and save to server
      subscribeToPush: async () => {
        try {
          const reg = await navigator.serviceWorker.ready;
          const sub = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: get().urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY),
          });

          await api.post("/users/update-push-sub", { subscription: JSON.stringify(sub) });
          console.log('Push subscribed!');
        } catch (err) {
          console.error('Sub failed:', err);
        }
      },

      // ✅ Helper for VAPID key decoding
      urlBase64ToUint8Array: (base64String) => {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
        const rawData = window.atob(base64);
        return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
      },
    })
  )
);

// ✅ Global socket listener for onlineUsers (runs once on import)
socket.on("onlineUsersUpdate", (users) => {
  useAuthStore.getState().setOnlineUsers(users);
});

if (import.meta.hot) {
  import.meta.hot.dispose(() => socket.off("onlineUsersUpdate"));
}