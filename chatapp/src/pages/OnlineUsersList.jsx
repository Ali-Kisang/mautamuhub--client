import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { socket } from "../utils/socket";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosInstance";
import { Circle } from "lucide-react";

export default function OnlineUsersList({ selectedUser }) {
  const { user } = useAuthStore();
  const { unreadCounts, incrementUnread, clearUnreadForUser } = useChatStore();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const navigate = useNavigate();

  const getAvatarUrl = (avatar) => {
    if (!avatar || avatar === "/default-avatar.png") {
      return "/default-avatar.png";
    }

    // If it's already a full URL, don’t prepend Cloudinary again
    if (avatar.startsWith("http")) {
      return avatar;
    }

    return `https://res.cloudinary.com/dcxggvejn/image/upload/${avatar}`;
  };

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

    // ✅ Listen for incoming messages (aligned event)
    socket.on("receiveMessage", (data) => {
      if (data.receiverId.toString() === user._id.toString()) {
        incrementUnread(data.senderId);
      }
    });

    // ✅ Typing handling (single senderId arg, targeted emit)
    socket.on("typing", (senderId) => {
      setTypingUsers((prev) => ({ ...prev, [senderId]: true }));
    });

    socket.on("stopTyping", (senderId) => {
      setTypingUsers((prev) => {
        const updated = { ...prev };
        delete updated[senderId];
        return updated;
      });
    });

    return () => {
      socket.off("onlineUsersUpdate");
      socket.off("receiveMessage");
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, [user, incrementUnread]);

  const handleSelectUser = async (u) => {
    if (u.userId === user._id) return;

    // ✅ Clear local unread for this user (updates total instantly)
    clearUnreadForUser(u.userId);

    // ✅ Call API to sync DB (for persistence/multi-device)
    try {
      await api.put(`/chat/mark-read/${u.userId}`);
    } catch (err) {
      console.error("Failed to mark read:", err);
      // Revert local if API fails? Optional: increment back, but rare.
    }

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
        <Circle className="w-3 h-3 text-green-500 rounded-full bg-green-500 animate-pulse" />
        <span className="text-pink-500">Online Users</span>
      </h2>

      {sortedUsers.length === 0 && (
        <p className="text-sm text-gray-500">No one is online.</p>
      )}

      {sortedUsers.map((u) => {
        const isMe = u.userId === user._id;
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
                src={getAvatarUrl(u.avatar)}   
                alt={u.username}
                className="w-10 h-10 rounded-full object-cover border"
              />
              <Circle
                className="absolute bottom-0 right-0 w-3 h-3 text-green-500  bg-green-500 rounded-full"
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
                <div className="flex items-center gap-2 mt-1">
                  
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce [animation-delay: -0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce [animation-delay: -0.4s]"></span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}