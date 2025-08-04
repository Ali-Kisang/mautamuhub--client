// 📌 Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { create } from "zustand";

// ✅ Auth store with persistence
const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  setAuth: (user, token) => {
    // Save to state
    set({ user, token });
    // ✅ Persist to localStorage
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    // ✅ Set default axios header
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
  const nav = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      setAuth(res.data.user, res.data.token);
      nav("/"); // Go to home
    } catch (err) {
      console.error(err);
      alert("Login failed. Check credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 to-purple-300">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-96 space-y-3"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-pink-600">
          Welcome Back
        </h2>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600"
        >
          Login
        </button>
        <p className="text-center text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="text-pink-600 font-semibold">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
