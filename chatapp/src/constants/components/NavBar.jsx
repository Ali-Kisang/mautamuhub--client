import { useState, useEffect } from "react";
import mautamuLogo from "../../assets/MautamuLogo.svg";
import { BsFillSearchHeartFill } from "react-icons/bs";
import { IoCloseCircleSharp } from "react-icons/io5";
import { FaBars, FaTimes } from "react-icons/fa";
import { useAuthStore } from "../../store/useAuthStore";
import { LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";
import UserSearchBar from "./UserSearchBar";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  const toggleSearch = () => setIsSearchOpen((prev) => !prev);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Main Navbar */}
      <nav
        className={`bg-white border-b border-gray-200 z-50 shadow-sm transition duration-300 ${
          isSticky ? "fixed top-0 left-0 w-full shadow-md" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-32 md:h-44">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img
                src={mautamuLogo}
                alt="MahabaHub Logo"
                className="md:h-44 h-32 w-auto cursor-pointer object-contain"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex space-x-8 items-center">
                <a href="/" className="text-gray-800 hover:text-coralPink font-medium">
                  Home
                </a>
                {!authUser ? (
                  <>
                    <a href="/register-escort" className="text-gray-800 hover:text-coralPink font-medium">
                      Register
                    </a>
                    <a href="/login-escort" className="text-gray-800 hover:text-coralPink font-medium">
                      Login
                    </a>
                  </>
                ) : (
                  <>
                    <a href="/escorts" className="text-gray-800 hover:text-coralPink font-medium">
                      Escorts
                    </a>
                    <a
                      href="/get-started"
                      className="px-4 py-2 bg-coralPink text-white rounded-lg hover:bg-pink transition font-medium"
                    >
                      Create Account
                    </a>
                    <Link to="/profile-page" className="btn btn-sm hover:bg-pink gap-2">
                      <User className="size-5" />
                      <span className="hidden sm:inline">Profile</span>
                    </Link>
                    <button onClick={logout} className="btn btn-sm hover:bg-pink flex gap-2 items-center">
                      <LogOut className="size-5" />
                      <span className="hidden sm:inline">Logout</span>
                    </button>
                  </>
                )}
              </div>

              {/* Search Button */}
              <button onClick={toggleSearch} className="text-coralPink hover:text-pink focus:outline-none">
                <BsFillSearchHeartFill className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={toggleMenu} className="text-coralPink focus:outline-none">
                {isMenuOpen ? (
                  <FaTimes className="w-6 h-6" />
                ) : (
                  <FaBars className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden mt-2 bg-white shadow-lg space-y-2 p-4 rounded-lg absolute top-32 w-full left-0 z-40">
              <a href="/" className="block text-gray-800 hover:text-coralPink font-medium">Home</a>
              {!authUser ? (
                <>
                  <a href="/register-escort" className="block text-gray-800 hover:text-coralPink font-medium">Register</a>
                  <a href="/login-escort" className="block text-gray-800 hover:text-coralPink font-medium">Login</a>
                </>
              ) : (
                <>
                  <a href="/escorts" className="block text-gray-800 hover:text-coralPink font-medium">Escorts</a>
                  <a href="/get-started" className="block text-white bg-coralPink rounded-lg px-4 py-2 hover:bg-pink">Get Started</a>
                  <Link to="/profile-page" className="block text-gray-800 hover:text-coralPink font-medium">Profile</Link>
                  <button onClick={logout} className="block w-full text-left text-gray-800 hover:text-coralPink font-medium">Logout</button>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* 🔍 Search Popup */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="relative bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto p-4 rounded-xl shadow-lg">
            <button
              onClick={toggleSearch}
              className="absolute top-3 right-3 text-red-600 hover:text-red-800 text-2xl"
            >
              <IoCloseCircleSharp />
            </button>
            <UserSearchBar />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
