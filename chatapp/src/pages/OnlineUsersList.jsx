import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { socket } from "../utils/socket";
import { useNavigate } from "react-router-dom";
import { Circle } from "lucide-react";

export default function OnlineUsersList({ selectedUser, onUnreadUpdate }) {
  const { user } = useAuthStore();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?._id) return;

    // Tell server I'm online
    socket.emit("userOnline", {
      userId: user._id,
      username: user.username || user.personal?.username || "Me",
      avatar: user.avatar || user.username?.charAt(0).toUpperCase(),
    });

    // Update online users
    socket.on("onlineUsersUpdate", (users) => {
      setOnlineUsers(users);
    });

    // ✅ Listen for incoming messages
    socket.on("newMessage", ({ senderId, receiverId }) => {
      if (receiverId === user._id) {
        setUnreadCounts((prev) => {
          const updated = { ...prev, [senderId]: (prev[senderId] || 0) + 1 };
          // Send total count up to NavBar
          if (onUnreadUpdate) {
            const total = Object.values(updated).reduce((a, b) => a + b, 0);
            onUnreadUpdate(total);
          }
          return updated;
        });
      }
    });

    // ✅ Typing handling
    socket.on("typing", ({ senderId, receiverId }) => {
      if (receiverId === user._id) {
        setTypingUsers((prev) => ({ ...prev, [senderId]: true }));
      }
    });

    socket.on("stopTyping", ({ senderId, receiverId }) => {
      if (receiverId === user._id) {
        setTypingUsers((prev) => {
          const updated = { ...prev };
          delete updated[senderId];
          return updated;
        });
      }
    });

    return () => {
      socket.off("onlineUsersUpdate");
      socket.off("newMessage");
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, [user, onUnreadUpdate]);

  const handleSelectUser = (u) => {
    if (u.userId === user._id) return;

    // Reset unread count for this user
    setUnreadCounts((prev) => {
      const updated = { ...prev, [u.userId]: 0 };
      if (onUnreadUpdate) {
        const total = Object.values(updated).reduce((a, b) => a + b, 0);
        onUnreadUpdate(total);
      }
      return updated;
    });

    navigate(`/chat/${u.userId}`);
  };

  // ✅ Put "Me" at the top
  const sortedUsers = [...onlineUsers].sort((a, b) => {
    if (a.userId === user?._id) return -1;
    if (b.userId === user?._id) return 1;
    return 0;
  });

  return (
    <div className="p-4 space-y-2 h-full overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Circle className="w-3 h-3 text-green-500 animate-pulse" />
        <span className="text-pink-500">Online Users</span>
      </h2>

      {sortedUsers.length === 0 && (
        <p className="text-sm text-gray-500">No one is online.</p>
      )}

      {sortedUsers.map((u) => {
        const isMe = u.userId === user?._id;
        const isSelected = selectedUser?._id === u.userId;
        const isTyping = typingUsers[u.userId] && !isMe;
        const unread = unreadCounts[u.userId] || 0;

        return (
          <div
            key={u.userId}
            onClick={() => handleSelectUser(u)}
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition
              ${isSelected ? "bg-pink-500 text-white" : "hover:bg-pink-100 text-gray-800"}
              ${isMe ? "ring-2 ring-pink-400" : ""}
            `}
          >
            {/* Avatar + status */}
            <div className="relative">
              <img
                src={u.avatar || "/default-avatar.png"}
                alt={u.username}
                className="w-10 h-10 rounded-full object-cover border"
              />
              <Circle
                className="absolute bottom-0 right-0 w-3 h-3 text-green-500 animate-pulse bg-white rounded-full"
                strokeWidth={6}
              />

              {/* 🔴 Unread Badge */}
              {unread > 0 && !isMe && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {unread}
                </span>
              )}
            </div>

            {/* Username + typing */}
            <div className="flex flex-col leading-tight">
              <span className="font-medium">
                {u.username || "Unnamed"}
                {isMe && <span className="text-xs ml-1">(You)</span>}
              </span>
              {isTyping && (
                <span className="text-xs text-green-500 animate-pulse">
                  typing…
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
