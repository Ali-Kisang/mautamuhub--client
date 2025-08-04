import { useEffect, useState, useRef } from "react";
import { socket } from "../utils/socket";
import { useAuthStore } from "../store/useAuthStore";
import OnlineUsersList from "./OnlineUsersList";
import ChatBox from "./ChatBox";
import { Toaster, toast } from "react-hot-toast";

export default function ChatPage() {
  const { user } = useAuthStore();
  const [selectedUser, setSelectedUser] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 🎵 audio reference
  const audioRef = useRef(null);

  useEffect(() => {
    // Preload notification sound
    audioRef.current = new Audio("/notify.wav");
  }, []);

  // ✅ handle incoming messages for unread counts and notifications
  useEffect(() => {
    if (!user?._id) return;

    const handleReceiveMessage = (msg) => {
      // 🔔 play sound if not your own message
      if (msg.senderId !== user._id) {
        // Only notify if chat with sender is not currently open
        if (!selectedUser || selectedUser.userId !== msg.senderId) {
          // increment unread
          setUnreadCounts((prev) => ({
            ...prev,
            [msg.senderId]: (prev[msg.senderId] || 0) + 1,
          }));

          // Play notification sound
          if (audioRef.current) {
            audioRef.current.currentTime = 0; // rewind
            audioRef.current.play().catch((err) => {
              console.warn("🔕 Sound play was blocked:", err);
            });
          }

          // 💡 Toast with message preview
          const preview =
            msg.message.length > 40
              ? msg.message.slice(0, 40) + "…"
              : msg.message;

          toast(`${msg.senderName || "User"}: ${preview}`, {
            icon: "💌",
            duration: 4000,
          });
        }
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);
    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [selectedUser, user?._id]);

  // ✅ when selecting a user
  const handleSelectUser = (u) => {
    setSelectedUser(u);
    setSidebarOpen(false);
    setUnreadCounts((prev) => ({ ...prev, [u.userId]: 0 }));
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* 🔔 Toast container */}
      <Toaster position="top-right" />

      {/* 📋 Sidebar */}
      <div
        className={`fixed md:static z-20 bg-white w-64 h-full border-r shadow-md transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <OnlineUsersList
          onSelectUser={handleSelectUser}
          selectedUser={selectedUser}
          unreadCounts={unreadCounts}
        />
      </div>

      {/* 💬 Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Top bar (mobile only) */}
        <div className="md:hidden p-2 border-b flex justify-between items-center bg-pink-600 text-white">
          <h1 className="font-bold text-lg">Chats</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="px-3 py-1 bg-white text-pink-600 rounded-lg font-medium"
          >
            {sidebarOpen ? "Close" : "Users"}
          </button>
        </div>

        {/* Chat Box */}
        <div className="flex-1 overflow-y-auto p-4">
          {selectedUser ? (
            <ChatBox
              receiver={selectedUser}
              onBack={() => setSelectedUser(null)}
            />
          ) : (
            <p className="text-center text-gray-500 mt-20">
              👈 Select a user to start chatting
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
