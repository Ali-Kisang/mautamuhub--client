// src/layouts/ProfileLayout.jsx
import { useState } from "react";
import OnlineUsersList from "../pages/OnlineUsersList";
import { Menu, X } from "lucide-react";

export default function ProfileLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeChat, setActiveChat] = useState(null);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden relative">
      {/* 👉 Sidebar (Desktop + Mobile Drawer) */}
      <aside
        className={`bg-white border-r h-full transition-all duration-300
          fixed inset-y-0 left-0 z-40
          transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          w-64 md:static md:translate-x-0`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <span className="font-bold text-pink-500 text-lg">Online Users</span>
          {/* Close button (mobile only) */}
          <button
            className="md:hidden p-1 rounded hover:bg-gray-100"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100%-3.5rem)]">
          <OnlineUsersList
            onSelectUser={setActiveChat}
            selectedUser={activeChat}
          />
        </div>
      </aside>

      {/* 👉 Overlay (mobile only) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 👉 Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        {/* Toggle button (mobile only) */}
        <button
          className="md:hidden absolute top-4 left-4 z-20 p-2 bg-white rounded-full shadow hover:bg-gray-100"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={20} />
        </button>

        {children}
      </main>
    </div>
  );
}
