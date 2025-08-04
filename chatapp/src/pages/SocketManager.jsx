// ✅ src/components/SocketManager.jsx
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { socket } from "../utils/socket";


export default function SocketManager() {
  const user = useAuthStore((s) => s.user);
  const setOnlineUsers = useAuthStore((s) => s.setOnlineUsers);

  useEffect(() => {
    if (user?._id) {
      // Let backend know this user is online
      socket.emit("userOnline", { userId: user._id });
    }

    // Listen for online users updates
    socket.on("onlineUsersUpdate", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("onlineUsersUpdate");
    };
  }, [user, setOnlineUsers]);

  return null; 
}
