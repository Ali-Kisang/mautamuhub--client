import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { socket } from "../utils/socket";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosInstance";
import { Circle, Clock } from "lucide-react";
import moment from "moment"; 

export default function RecentChatsList({ selectedUser }) {
  const { user } = useAuthStore();
  const { unreadCounts, incrementUnread, clearUnreadForUser, fetchRecentConversations } = useChatStore();
  const [conversations, setConversations] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const [onlineUsersSet, setOnlineUsersSet] = useState(new Set());
  const navigate = useNavigate();

  const getAvatarUrl = (avatar) => {
    if (!avatar || avatar === "/default-avatar.png") {
      return "/default-avatar.png";
    }
    if (avatar.startsWith("http")) {
      return avatar;
    }
    return `https://res.cloudinary.com/dcxggvejn/image/upload/${avatar}`;
  };

  // Format last seen
  const formatLastSeen = (lastSeen) => {
    if (!lastSeen) return "Long ago";
    const now = new Date();
    const diff = now - new Date(lastSeen);
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  useEffect(() => {
    if (!user?._id) return;

    // Initial fetch
    const loadConversations = async () => {
  try {
    await fetchRecentConversations();
    const { data } = await api.get("/chat/recent");
    console.log("Loaded convos:", data.length, data.map(c => ({ id: c.userId, unread: c.unreadCount }))); // Debug
    setConversations(data);
  } catch (err) {
    console.error("Failed to load conversations:", err);
    setConversations([]);
  }
};
    loadConversations();

    // Socket for real-time
    socket.emit("userOnline", {
      userId: user._id,
      username: user.username || user.personal?.username || "Me",
      avatar: user.avatar || user.username?.charAt(0).toUpperCase(),
    });

    socket.on("onlineUsersUpdate", (users) => {
      const onlineSet = new Set(users.map(u => u.userId));
      setOnlineUsersSet(onlineSet);
    });

    socket.on("receiveMessage", (data) => {
      if (data.receiverId.toString() === user._id.toString()) {
        incrementUnread(data.senderId);
        // Update convo: Add to top if new sender, or update last msg
        setConversations(prev => {
          const existingIndex = prev.findIndex(c => c.userId === data.senderId);
          if (existingIndex > -1) {
            const updated = { ...prev[existingIndex], lastMessage: { ...data, isMine: false }, unreadCount: (prev[existingIndex].unreadCount || 0) + 1 };
            const newList = [...prev];
            newList[existingIndex] = updated;
            return newList.sort((a, b) => new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt));
          }
          // New convo: Add to top (minimal data—refetch on open for full)
          const newConvo = {
            userId: data.senderId,
            username: "Unknown", // Will update on refetch
            avatar: "/default-avatar.png",
            lastMessage: data,
            unreadCount: 1,
            lastSeen: data.createdAt // Temp
          };
          return [newConvo, ...prev];
        });
      }
    });

    // FIXED: Typing/StopTyping: Backend emits single senderId (targeted via room), so handle as string
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

    // Refetch on focus for sync
    const handleFocus = () => loadConversations();
    window.addEventListener("focus", handleFocus);

    return () => {
      socket.off("onlineUsersUpdate");
      socket.off("receiveMessage");
      socket.off("typing");
      socket.off("stopTyping");
      window.removeEventListener("focus", handleFocus);
    };
  }, [user, incrementUnread, fetchRecentConversations]);

  const handleSelectUser = async (convo) => {
    if (convo.userId === user._id) return;

    clearUnreadForUser(convo.userId);
    try {
      await api.put(`/chat/mark-read/${convo.userId}`);
      // Refetch after mark to update list
      const { data } = await api.get("/chat/recent");
      setConversations(data);
    } catch (err) {
      console.error("Failed to mark read:", err);
    }

    navigate(`/chat/${convo.userId}`);
  };

  // Sort: Recent messages first, then online, then alpha
  const sortedConversations = [...conversations].sort((a, b) => {
    const timeA = new Date(a.lastMessage.createdAt).getTime();
    const timeB = new Date(b.lastMessage.createdAt).getTime();
    if (timeA !== timeB) return timeB - timeA; // Recent first

    const onlineA = onlineUsersSet.has(a.userId);
    const onlineB = onlineUsersSet.has(b.userId);
    if (onlineA !== onlineB) return onlineA ? -1 : 1; // Online first

    return (a.username || "").localeCompare(b.username || "");
  });

  return (
    <div className="p-4 space-y-2 h-full overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Circle className="w-3 h-3 text-green-500 rounded-full bg-green-500 animate-pulse" />
        <span className="text-pink-500">Messages</span>
      </h2>

      {sortedConversations.length === 0 && (
        <p className="text-sm text-gray-500">No messages yet.</p>
      )}

      {sortedConversations.map((convo) => {
        const isMe = convo.userId === user._id.toString();
        const isSelected = selectedUser?._id === convo.userId;
        const isOnline = onlineUsersSet.has(convo.userId) && !isMe;
        const isTyping = typingUsers[convo.userId] && !isMe;
        const unread = unreadCounts[convo.userId] || 0;
        const lastSeen = formatLastSeen(convo.lastSeen || convo.lastMessage.createdAt);

        return (
          <div
            key={convo.userId}
            onClick={() => handleSelectUser(convo)}
            className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition
              ${isSelected ? "bg-pink-500 text-white" : "hover:bg-pink-100 text-gray-800"}
              ${isMe ? "ring-2 ring-pink-400" : ""}
            `}
          >
            {/* Avatar + status */}
            <div className="relative flex-shrink-0">
              <img
                src={getAvatarUrl(convo.avatar)}
                alt={convo.username}
                className="w-12 h-12 rounded-full object-cover border"
              />
              {isOnline && (
                <Circle
                  className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                  strokeWidth={3}
                />
              )}
              {/* Unread Badge */}
              {unread > 0 && !isMe && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[1.2em] flex items-center justify-center">
                  {unread}
                </span>
              )}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <span className="font-semibold truncate">
                  {convo.username || "Unnamed"}
                  {isMe && <span className="text-xs ml-1">(You)</span>}
                </span>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock size={12} />
                  {lastSeen}
                </span>
              </div>
              <p className="text-sm text-gray-600 truncate mt-1">
                {convo.lastMessage.message.substring(0, 30)}...
                {convo.lastMessage.isMine && <span className="text-blue-500 ml-1">You</span>}
              </p>
              {isTyping && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce [animation-delay: -0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce [animation-delay: -0.4s]"></span>
                  </div>
                  <span className="text-xs text-pink-500">typing...</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}