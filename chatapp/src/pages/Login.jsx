import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { create } from "zustand";
import { TailSpin } from "react-loader-spinner";
import { EyeIcon,  EyeOffIcon } from "@heroicons/react/outline";

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  setAuth: (user, token) => {
    
    set({ user, token });
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  },
  logout: () => {
    set({ user: null, token: null });
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  },
}));

// ✅ On app load, if token exists, set axios default header
const tokenFromStorage = localStorage.getItem("token");
if (tokenFromStorage) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${tokenFromStorage}`;
}

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const nav = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      setAuth(res.data.user, res.data.token);
      nav("/");
    } catch (err) {
      console.error(err);
      alert("Login failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-pink-300 to-pink-400 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-4"
      >
        <h2 className="text-3xl font-extrabold mb-4 text-center text-pink-600">
          Welcome Back
        </h2>

        {/* Email */}
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-3 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
          required
        />

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-3 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 pr-12"
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-3 flex items-center text-pink-500 hover:text-pink-700"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <EyeOffIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Submit Button with Spinner */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-500 hover:cursor-pointer hover:bg-pink-600 text-white py-3 rounded-lg font-semibold transition duration-200 flex items-center justify-center"
        >
          {loading ? (
            <TailSpin height={24} width={24} color="#fff" />
          ) : (
            "Login"
          )}
        </button>

        <p className="text-center text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="text-pink-600 font-semibold hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
