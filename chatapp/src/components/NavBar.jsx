import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Menu, X, MessageCircle, Search } from "lucide-react";
import { useState, useEffect } from "react";

export default function NavBar() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const unreadCount = 13;

  const handleLogout = () => {
    logout();
    nav("/login");
    setOpen(false);
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      nav(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
      window.scrollTo(0, 0);
    }
  };

  // Close search overlay on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50 mb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              to="/"
              className="text-3xl md:text-4xl font-extrabold text-pink-600 tracking-tight"
            >
              Mautamuhub
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8 items-center text-lg lg:text-xl font-medium">
              <Link
                to="/profile"
                className="text-pink-600 hover:text-pink-700 transition-colors duration-200"
              >
                Profile
              </Link>

              {/* Messenger */}
              <Link
                to="/chat"
                className="relative text-pink-600 hover:text-pink-700 transition-colors duration-200 flex items-center"
                title="Messenger"
              >
                <MessageCircle size={28} strokeWidth={2.5} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-pink-700 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </Link>

              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="text-pink-600 hover:text-pink-700 transition-colors duration-200"
                title="Search"
              >
                <Search size={26} strokeWidth={2.5} />
              </button>

              <Link
                to="/create-account"
                className="text-pink-600 hover:text-pink-700 transition-colors duration-200"
              >
                Create Account
              </Link>
              {!user ? (
                <Link
                  to="/login"
                  className="px-4 py-2 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition-colors duration-200"
                >
                  Login
                </Link>
              ) : (
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition-colors duration-200"
                >
                  Logout
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-4">
              <button
                onClick={() => setSearchOpen(true)}
                className="text-pink-600 hover:text-pink-700"
              >
                <Search size={26} />
              </button>
              <button
                onClick={() => setOpen(true)}
                className="text-gray-700 hover:text-pink-600 focus:outline-none"
              >
                <Menu size={32} />
              </button>
            </div>
          </div>
        </div>

        {/* Overlay */}
        {open && (
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setOpen(false)}
          ></div>
        )}

        {/* Mobile Sidebar Menu */}
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <span className="text-2xl font-bold text-pink-600">Menu</span>
            <button
              onClick={() => setOpen(false)}
              className="text-pink-600 hover:text-pink-700 cursor-pointer focus:outline-none"
            >
              <X size={28} />
            </button>
          </div>
          <div className="flex flex-col space-y-6 px-6 py-6 text-lg font-medium">
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="text-pink-600 hover:text-pink-700"
            >
              Profile
            </Link>
            <Link
              to="/chat"
              onClick={() => setOpen(false)}
              className="relative text-pink-600 hover:text-pink-700 flex items-center gap-2"
            >
              <MessageCircle size={24} />
              Messenger
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-pink-700 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md animate-pulse">
                  {unreadCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => {
                setOpen(false);
                setSearchOpen(true);
              }}
              className="text-pink-600 hover:text-pink-700 flex items-center gap-2"
            >
              <Search size={22} /> Search
            </button>
            <Link
              to="/create-account"
              onClick={() => setOpen(false)}
              className="text-pink-600 hover:text-pink-700"
            >
              Create Account
            </Link>
            {!user ? (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-pink-600 text-white rounded-xl text-center hover:bg-pink-700"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-pink-600  rounded-xl text-left hover:bg-pink-700 hover:text-white transition-colors duration-200"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* 🔍 Fullscreen Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 bg-white bg-opacity-95 backdrop-blur-sm z-[60] flex flex-col items-center justify-center p-6 overflow-auto">
          <button
            onClick={() => setSearchOpen(false)}
            className="absolute top-6 right-6 text-pink-600 hover:text-pink-700 text-3xl font-bold"
          >
            <X size={32} />
          </button>
          <h2 className="text-2xl font-bold text-pink-700 mb-6">Search</h2>
          <div className="relative w-full max-w-lg">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type to search..."
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearchSubmit();
              }}
              className="w-full border-2 border-pink-400 rounded-xl p-3 text-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-3 text-gray-400 hover:text-pink-500"
              >
                <X size={20} />
              </button>
            )}
          </div>
          <button
            onClick={handleSearchSubmit}
            className="mt-4 px-6 py-2 bg-pink-600 text-white rounded-xl hover:bg-pink-700"
          >
            Search
          </button>
        </div>
      )}
    </>
  );
}
