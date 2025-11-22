// src/components/NavBar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore"; // ✅ Added
import { Menu, X, MessageCircle, Search, Home, User, LogOut, UserPlus } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { DotSpinner } from "@uiball/loaders";
import api from "../utils/axiosInstance"; // ✅ Added for fetch

import Loader from "../pages/Loader";

export default function NavBar() {
  const { user, logout, loading: authLoading } = useAuthStore();
  const {  setUnreadCounts, getTotalUnread } = useChatStore(); 
  const nav = useNavigate();

  // UI state
  const [open, setOpen] = useState(false); // mobile sidebar
  const [searchOpen, setSearchOpen] = useState(false); // fullscreen search overlay
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [loading, setLoading] = useState(true);

  // refs for click-outside behavior
  const overlayRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Computed unread badge
  const totalUnread = getTotalUnread(); // ✅ Call getter for dynamic total

  // Cloudinary
  const CLOUD_NAME = "dcxggvejn"; 

  // helper: safely escape HTML for insertion
  const escapeHtml = (unsafe) => {
    if (!unsafe && unsafe !== 0) return "";
    return String(unsafe)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  // helper: escape user query for regex usage
  const escapeRegExp = (str) =>
    str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // highlight matched substring in a safe way (escape text first)
  const highlightMatch = (text = "", query = "") => {
    if (!query) return escapeHtml(text);
    const escapedText = escapeHtml(text);
    const safeQuery = escapeRegExp(query);
    const regex = new RegExp(`(${safeQuery})`, "ig");
    return escapedText.replace(regex, "<mark class='bg-yellow-200'>$1</mark>");
  };

  // build cloudinary url (thumbnail)
  const getImageUrl = (publicId) => {
    if (!publicId) return null;
    // use transformations for consistent thumbnails
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/c_fill,h_80,w_80/${publicId}`;
  };

  // fetch suggestions
  const fetchSuggestions = async (q) => {
    if (!q || !q.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      setLoading(true);
      const res = await api.get("/search", {
        params: { q: q.trim(), limit: 5 },
      });
      setSuggestions(res.data?.profiles || []);
      setActiveIndex(-1);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  // debounced fetching when typing
  useEffect(() => {
    if (!searchOpen) return; // only fetch when overlay is open
    const timer = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        fetchSuggestions(searchQuery);
      } else {
        setSuggestions([]);
      }
    }, 300); // 300ms debounce
    return () => clearTimeout(timer);
  }, [searchQuery, searchOpen]);

  // ✅ Fetch initial unread on user load (sets store)
  useEffect(() => {
    if (!user) {
      setUnreadCounts({}); 
      return;
    }

    const fetchInitialUnread = async () => {
      try {
        const res = await api.get("/chat/unread/by-user");
        const counts = {};
        res.data.forEach(({ _id, count }) => {
          counts[_id] = count;
        });
        setUnreadCounts(counts); // Triggers total calc
      } catch (err) {
        console.error("Failed to fetch initial unread:", err);
      }
    };

    fetchInitialUnread();
  }, [user, setUnreadCounts]);

  // close overlay/suggestions on ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setSuggestions([]);
        setSearchQuery("");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // click outside to close suggestions (only when overlay open)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!searchOpen) return;
      if (
        overlayRef.current &&
        !overlayRef.current.contains(e.target)
      ) {
        // clicked outside overlay => close everything
        setSearchOpen(false);
        setSuggestions([]);
        setSearchQuery("");
      } else if (
        inputRef.current &&
        !inputRef.current.contains(e.target) &&
        listRef.current &&
        !listRef.current.contains(e.target)
      ) {
        // clicked outside input/list but inside overlay => hide list only
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchOpen]);

  // keyboard navigation of suggestions (when overlay open)
  const handleOverlayKeyDown = (e) => {
    if (!suggestions.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        const id = suggestions[activeIndex]._id;
        setSearchOpen(false);
        setSearchQuery("");
        setSuggestions([]);
        nav(`/profile/${id}`);
      } else {
        // no active suggestion => go to full search page
        if (searchQuery.trim()) {
          setSearchOpen(false);
          setSuggestions([]);
          const q = encodeURIComponent(searchQuery.trim());
          nav(`/search?q=${q}`);
        }
      }
    }
  };

  // handle search submit from overlay (Search button or Enter with no active suggestion)
  const handleSearchSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = encodeURIComponent(searchQuery.trim());
    setSearchOpen(false);
    setSuggestions([]);
    setSearchQuery("");
    nav(`/search?q=${q}`);
    window.scrollTo(0, 0);
  };

  // logout
  const handleLogout = () => {
    logout();
    nav("/login");
    setOpen(false);
  };

  // Modern bottom nav handlers
  const handleBottomNavClick = (path, onClick) => {
    if (onClick) onClick();
    nav(path);
  };

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 left-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18">
            {/* Logo + Greeting (mobile) */}
            <div className="flex items-center gap-2 md:gap-4">
              <Link to="/">
                <img
                  src="/MautamuLogo.png"
                  alt="Mautamuhub Logo"
                  className="h-20 sm:h-40 md:h-48 lg:h-64 w-auto object-contain"
                />
              </Link>
              
             
            </div>
 {/* Greeting - Mobile only, between logo and right icons */}
             {user && (
  <div className="md:hidden flex justify-center items-center w-full">
    <span className="text-lg text-pink-500 italic font-medium truncate max-w-[200px] text-center">
      <span className="animate-pulse inline-block">👋</span>{' '}
      Hi, {user.username || "User"}!
    </span>
  </div>
)}
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8 items-center text-lg lg:text-xl font-medium">
              {user && (
                <>
                  <span className="text-md text-pink-500 italic font-medium">
                   👋 Hi, {user.username || "User"}
                  </span>
                  <Link
                    to="/profile"
                    className="text-pink-600 hover:text-pink-700 transition-colors duration-200"
                  >
                    Profile
                  </Link>

                  <Link
                    to="/profile" // ✅ Updated to /chat for proper functionality
                    className="relative text-pink-600 hover:text-pink-700 transition-colors duration-200 flex items-center"
                    title="Messenger"
                  >
                    <MessageCircle size={28} strokeWidth={2.5} />
                    {totalUnread > 0 && (
                      <span className="absolute -top-1 -right-2 bg-pink-700 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md animate-pulse">
                        {totalUnread}
                      </span>
                    )}
                  </Link>

                  <Link
                    to="/create-account"
                    className="text-pink-600 hover:text-pink-700 transition-colors duration-200"
                  >
                    Create Account
                  </Link>
                </>
              )}

              {/* Search Icon - Always Visible */}
              <button
                onClick={() => {
                  setSearchOpen(true);
                  setTimeout(() => inputRef.current?.focus(), 0);
                }}
                className="text-pink-600 hover:text-pink-700 transition-colors duration-200"
                title="Search"
              >
                <Search size={26} strokeWidth={2.5} />
              </button>

              {/*Register / Logout / Loader */}
              {authLoading ? (
                <div className="px-4 py-2">
                  <Loader text="" size={20} color="text-pink-600" />
                </div>
              ) : !user ? (
                <Link
                  to="/register"
                  className="px-4 py-2 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition-colors duration-200 hover:cursor-pointer"
                >
                 Register
                </Link>
              ) : (
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition-colors duration-200 hover:cursor-pointer"
                >
                  Logout
                </button>
              )}
            </div>

            {/* Mobile Menu Button - Simplified for bottom nav integration */}
            <div className="md:hidden flex items-center space-x-3">
              <button onClick={() => { setSearchOpen(true); setTimeout(() => inputRef.current?.focus(), 0); }} className="text-pink-600 hover:text-pink-700">
                <Search size={26} />
              </button>
              {/* Hamburger now opens a simplified mobile menu for non-bottom-nav items */}
              <button onClick={() => setOpen(true)} className="text-gray-700 hover:text-pink-600 focus:outline-none">
                <Menu size={32} className="hover:cursor-pointer" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {open && (
          <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setOpen(false)}></div>
        )}

        {/* Mobile Sidebar - Now simplified for additional actions */}
        <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out md:hidden ${open ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex justify-between items-center p-4 border-b">
            <span className="text-2xl font-bold text-pink-600">Menu</span>
            <button onClick={() => setOpen(false)} className="text-pink-600 hover:text-pink-700"><X size={28} /></button>
          </div>

          <div className="flex flex-col space-y-6 p-6 text-lg font-medium">
  {user && (
    <>
    <span className="text-sm text-pink-500 italic font-medium">
       👋 Hi, {user.username || "User"}
      </span>
      <Link
        to="/profile"
        onClick={() => setOpen(false)}
        className="text-pink-600 hover:text-pink-700 transition-colors duration-200"
      >
        Profile
      </Link>

      <Link
        to="/chat"
        onClick={() => setOpen(false)}
        className="relative text-pink-600 hover:text-pink-700 transition-colors duration-200 flex items-center"
        title="Messenger"
      >
        <MessageCircle className="text-pink-500 hover:text-pink-600" size={28} strokeWidth={2.5} />
        {totalUnread > 0 && (
          <span className="absolute -top-1 -right-2 bg-pink-700 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md animate-pulse">
            {totalUnread}
          </span>
        )}
      </Link>

      <Link
        to="/create-account"
        onClick={() => setOpen(false)}
        className="text-pink-600 hover:text-pink-700 transition-colors duration-200"
      >
        Create Account
      </Link>
    </>
  )}

  {/*Register / Logout / Loader */}
  {authLoading ? (
    <div className="flex justify-center py-2">
      <Loader text="" size={20} color="text-pink-600" />
    </div>
  ) : !user ? (
    <Link
      to="/register"
      onClick={() => setOpen(false)}
      className="px-4 py-2 bg-pink-600 text-white rounded-xl text-center hover:bg-pink-700"
    >
     Register
    </Link>
  ) : (
    <button
      onClick={handleLogout}
      className="px-4 py-2 text-white rounded-xl bg-pink-600 hover:bg-pink-700 hover:cursor-pointer"
    >
      Logout
    </button>
  )}
</div>
        </div>
      </nav>

      {/* Modern Tinder-like Bottom Navigation - Mobile Only */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 md:hidden">
        <div className="flex justify-around items-center h-16 px-4">
          {/* Home */}
          <Link
            to="/"
            className="flex flex-col items-center text-gray-600 hover:text-pink-600 transition-colors duration-200"
            title="Home"
          >
            <Home className="text-pink-500 hover:text-pink-600" size={24} />
            <span className="text-xs mt-1 font-medium">Home</span>
          </Link>

          {/* Search */}
          <button
            onClick={() => {
              setSearchOpen(true);
              setTimeout(() => inputRef.current?.focus(), 0);
            }}
            className="flex flex-col items-center text-gray-600 hover:text-pink-600 transition-colors duration-200"
            title="Search"
          >
            <Search size={24}  className="text-pink-500 hover:text-pink-600"/>
            <span className="text-xs mt-1 font-medium">Search</span>
          </button>

          {/* Chat */}
          <Link
            to="/profile"
            className="flex flex-col items-center relative text-gray-600 hover:text-pink-600 transition-colors duration-200"
            title="Chat"
          >
            <MessageCircle size={24} className="text-pink-500 hover:text-pink-600" />
            {totalUnread > 0 && (
              <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md animate-pulse">
                {totalUnread}
              </span>
            )}
            <span className="text-xs mt-1 font-medium">Chat</span>
          </Link>

          {/* Profile */}
          <Link
            to="/profile"
            className="flex flex-col items-center text-gray-600 hover:text-pink-600 transition-colors duration-200"
            title="Profile"
          >
            <User className="text-pink-500 hover:text-pink-600" size={24} />
            <span className="text-xs mt-1 font-medium">Profile</span>
          </Link>
        </div>
      </div>

      {/* Fullscreen Search Overlay */}
      {searchOpen && (
        <div
          ref={overlayRef}
          className="fixed inset-0 bg-white bg-opacity-95 backdrop-blur-sm z-[60] flex flex-col items-center justify-start p-6 overflow-auto"
          onKeyDown={handleOverlayKeyDown}
        >
          <button onClick={() => { setSearchOpen(false); setSearchQuery(""); setSuggestions([]); }} className="absolute top-6 right-6 text-pink-600 hover:text-pink-700 text-3xl font-bold">
            <X size={32} />
          </button>

          <h2 className="text-2xl font-bold text-pink-700 mb-6 mt-10">Search</h2>

          <div className="relative w-full max-w-lg">
            <form onSubmit={handleSearchSubmit} className="flex">
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); }}
                placeholder="Search by username, county, local area..."
                className="w-full border-2 border-pink-400 rounded-xl p-3 text-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                aria-label="Search profiles"
                autoComplete="off"
              />
              <button type="submit" className="ml-3 mt-0 px-6 py-2 bg-pink-600 text-white rounded-xl hover:bg-pink-700 hover:cursor-pointer">
                Search
              </button>
            </form>

            {/* clear button */}
            {searchQuery && (
              <button onClick={() => { setSearchQuery(""); setSuggestions([]); inputRef.current?.focus(); }} className="absolute right-28 top-3 text-gray-400 hover:text-pink-500">
                <X size={18} />
              </button>
            )}

            {/* Loading indicator */}
            {loading && (
  <div className="absolute left-0 right-0 bg-white border border-pink-200 rounded-b-xl mt-2 px-4 py-2 flex justify-center">
    <Loader text="" size={24} color="text-pink-600" />
  </div>
)}

           {/* Suggestions list */}
            {suggestions.length > 0 && (
              <ul ref={listRef} className="absolute left-0 right-0 bg-white shadow-lg border mt-2 rounded-b-xl z-50 max-h-96 overflow-y-auto">
                {suggestions.map((profile, idx) => (
                  <li
                    key={profile._id}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery("");
                      setSuggestions([]);
                      nav(`/profile/${profile._id}`);
                    }}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                      idx === activeIndex ? "bg-pink-50" : "hover:bg-pink-50"
                    }`}
                  >
                    {/* Thumbnail */}
                    {profile.photos && profile.photos.length > 0 ? (
                      <img
                        src={getImageUrl(profile.photos[0])}
                        alt={profile.personal?.username || "Profile"}
                        className="w-12 h-12 object-cover rounded-full border shadow-sm transform transition-transform duration-200 hover:scale-110"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 text-xs">
                        No Image
                      </div>
                    )}

                    {/* Info with highlighting (safe) */}
                    <div className="overflow-hidden">
                      <p
                        className="font-semibold truncate"
                        dangerouslySetInnerHTML={{
                          __html: highlightMatch(profile.personal?.username || "Unnamed", searchQuery),
                        }}
                      />
                      <p
                        className="text-sm text-gray-500 truncate"
                        dangerouslySetInnerHTML={{
                          __html: highlightMatch(`${profile.location?.county || ""}, ${profile.location?.localArea || ""}`, searchQuery),
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* No results */}
            {!loading && searchQuery.trim() && suggestions.length === 0 && (
              <div className="absolute left-0 right-0 bg-white shadow-lg border mt-2 rounded-b-xl z-50 p-3 text-gray-500">
                No results found for "<span className="font-medium">{escapeHtml(searchQuery)}</span>"
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}