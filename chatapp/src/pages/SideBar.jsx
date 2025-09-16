// src/components/Sidebar.jsx
import { useNavigate } from "react-router-dom";

export default function Sidebar({ onlineUsers }) {
  const navigate = useNavigate();

  return (
    <div className="w-64 border-r bg-gray-50 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Chats</h2>
      <ul className="space-y-2">
        {onlineUsers?.map((user) => (
          <li
            key={user._id}
            onClick={() => navigate(`/chat/${user._id}`)}
            className="cursor-pointer p-2 rounded-lg hover:bg-pink-100 transition"
          >
            <div className="flex items-center gap-2">
              <img
                src={user.profilePic || "/default-avatar.png"}
                alt={user.username}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span>{user.username}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
