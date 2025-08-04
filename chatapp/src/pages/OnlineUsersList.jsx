import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { socket } from "../utils/socket";

/**
 * Props:
 *  onSelectUser: function(user) called when a user is clicked
 *  selectedUser: currently selected user object
 */
export default function OnlineUsersList({ onSelectUser, selectedUser }) {
  const { user } = useAuthStore();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);

  useEffect(() => {
    if (user?._id) {
      // Notify server I am online
      socket.emit("userOnline", {
  userId: user._id,
  username: user.username || user.personal?.username || "Me",
  avatar: user.avatar || user.username?.charAt(0).toUpperCase(),
});
    }

    // Listen for updates
    socket.on("onlineUsersUpdate", (users) => {
      setOnlineUsers(users);
    });

    // Typing indicators
    socket.on("typing", (senderId) => {
      setTypingUsers((prev) => {
        if (!prev.includes(senderId)) return [...prev, senderId];
        return prev;
      });
    });

    socket.on("stopTyping", (senderId) => {
      setTypingUsers((prev) => prev.filter((id) => id !== senderId));
    });

    return () => {
      socket.off("onlineUsersUpdate");
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, [user]);

  return (
    <div className="p-4 space-y-2 h-full overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        🟢 Online Users
      </h2>

      {onlineUsers.length === 0 && (
        <p className="text-sm text-gray-500">No one is online.</p>
      )}

      {onlineUsers.map((u) => {
        const isMe = u.userId === user?._id;
        const isSelected = selectedUser?._id === u.userId;

        return (
          <div
            key={u.userId}
            onClick={() => !isMe && onSelectUser(u)}
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition
              ${
                isSelected
                  ? "bg-pink-500 text-white"
                  : "hover:bg-pink-100 text-gray-800"
              }
              ${isMe ? "ring-2 ring-pink-400" : ""}
            `}
          >
            {/* Avatar */}
            <div className="relative">
              <img
                src={u.avatar || "/default-avatar.png"}
                alt={u.username}
                className="w-10 h-10 rounded-full object-cover border"
              />
              <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-white bg-green-500"></span>
            </div>

            {/* Username and typing */}
            <div className="flex flex-col leading-tight">
              <span className="font-medium">
                {u.username || "Unnamed"}
                {isMe && <span className="text-xs ml-1">(You)</span>}
              </span>
              {typingUsers.includes(u.userId) && !isMe && (
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
