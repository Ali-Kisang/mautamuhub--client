import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { socket } from "../utils/socket";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosInstance";
import { Circle, Clock, Search } from "lucide-react";
import moment from "moment"; 
import { useMemo } from "react";

export default function RecentChatsList({ selectedUser }) {
  const { user, onlineUsers, setOnlineUsers } = useAuthStore(); // ✅ Use full onlineUsers from store
  const { unreadCounts, incrementUnread, clearUnreadForUser, fetchRecentConversations } = useChatStore();
  const [conversations, setConversations] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const [onlineUsersSet, setOnlineUsersSet] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
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

  // ✅ Helper: Format online user as convo entry
  const formatOnlineAsConvo = (onlineUser) => ({
    userId: onlineUser.userId,
    username: onlineUser.username,
    avatar: onlineUser.avatar,
    lastMessage: {
      message: "Say hi to start chatting!",
      createdAt: new Date(), // Use now for sorting to top
      senderId: null,
      isMine: false
    },
    unreadCount: 0,
    lastSeen: new Date() // For fallback
  });

  useEffect(() => {
    if (!user?._id) return;

    // Initial fetch (merged recent + online from backend)
    const loadConversations = async () => {
      try {
        await fetchRecentConversations();
        const { data } = await api.get("/chat/recent");
        console.log("Loaded convos + online:", data.length, data.map(c => ({ id: c.userId, unread: c.unreadCount, message: c.lastMessage?.message?.substring(0,20) })));
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
      setOnlineUsers(users); // ✅ Store full list in authStore
      const onlineSet = new Set(users.map(u => u.userId));
      setOnlineUsersSet(onlineSet);
      console.log("Updated online set:", onlineSet.size, "full users:", users.length); // Enhanced debug
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
  }, [user, incrementUnread, fetchRecentConversations, setOnlineUsers]); // Add setOnlineUsers dep

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

  // ✅ Derive full list: convos + online-only (exclude self/duplicates)
  const fullList = useMemo(() => {
    const convoIds = new Set(conversations.map(c => c.userId));
    const onlineOnly = onlineUsers
      .filter(ou => ou.userId !== user._id && !convoIds.has(ou.userId))
      .map(formatOnlineAsConvo);
    return [...conversations, ...onlineOnly];
  }, [conversations, onlineUsers, user._id]);

  // Sort: Recent messages first, then online, then alpha
  const sortedConversations = [...fullList].sort((a, b) => {
    const timeA = new Date(a.lastMessage?.createdAt || a.lastSeen).getTime();
    const timeB = new Date(b.lastMessage?.createdAt || b.lastSeen).getTime();
    if (timeA !== timeB) return timeB - timeA; // Recent first

    const onlineA = onlineUsersSet.has(a.userId);
    const onlineB = onlineUsersSet.has(b.userId);
    if (onlineA !== onlineB) return onlineA ? -1 : 1; // Online first

    return (a.username || "").localeCompare(b.username || "");
  });

  // ✅ Filter convos by search (includes online users)
  const filteredConversations = sortedConversations.filter(convo =>
    (convo.username || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (convo.lastMessage?.message || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ Helper: Check if this is an online-only entry (no real messages yet)
  const isOnlineOnly = (convo) => 
    convo.lastMessage?.message === "Say hi to start chatting!" || !convo.lastMessage?.message;

  return (
    <div className="p-4 space-y-2 h-full overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Circle className="w-3 h-3 text-green-500 rounded-full bg-green-500 animate-pulse" />
        <span className="text-pink-500">Messages</span>
        <span className="text-xs text-gray-400 ml-auto">({filteredConversations.length})</span>
      </h2>

      {/* ✅ Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search messages or users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        )}
      </div>

      {filteredConversations.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8">
          {searchQuery ? "No matches found." : "No messages yet. Start chatting with online users!"}
        </p>
      ) : (
        filteredConversations.map((convo) => {
          const isMe = convo.userId === user._id.toString();
          const isSelected = selectedUser?._id === convo.userId;
          const isOnline = onlineUsersSet.has(convo.userId) && !isMe;
          const isTyping = typingUsers[convo.userId] && !isMe;
          const unread = unreadCounts[convo.userId] || 0;
          const lastSeen = formatLastSeen(convo.lastSeen || convo.lastMessage?.createdAt);
          const isOnlineOnlyEntry = isOnlineOnly(convo);

          return (
            <div
              key={convo.userId}
              onClick={() => handleSelectUser(convo)}
              className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition
                ${isSelected ? "bg-pink-500 text-white" : "hover:bg-pink-50 text-gray-800"}
                ${isMe ? "ring-2 ring-pink-400" : ""}
                ${isOnlineOnlyEntry ? "border-l-4 border-green-400" : ""}
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
                  <span className="font-semibold truncate flex items-center gap-1">
                    {convo.username || "Unnamed"}
                    {isOnlineOnlyEntry && <span className="text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded">New</span>}
                    {isMe && <span className="text-xs ml-1">(You)</span>}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock size={12} />
                    {lastSeen}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate mt-1">
                  {isOnlineOnlyEntry 
                    ? "Say hi to start chatting!" 
                    : convo.lastMessage.message.substring(0, 30) + "..."
                  }
                  {!isOnlineOnlyEntry && convo.lastMessage.isMine && <span className="text-blue-500 ml-1">You</span>}
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
        })
      )}
    </div>
  );
}