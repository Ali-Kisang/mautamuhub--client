import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";
import { useAuthStore } from "../store/useAuthStore";
import { showToast } from "../components/utils/showToast";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const nav = useNavigate();
  // 🔹 UPDATED: Split selectors to avoid object reference issues—no need for shallow
  const login = useAuthStore((s) => s.login);
  const user = useAuthStore((s) => s.user);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      showToast("Login successful!", false);
    } catch (err) {
      console.error(err);
      showToast("Login failed. Check credentials.", true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      if (!user.hasProfile) {
        nav("/profile", { replace: true });
      } else {
        nav("/", { replace: true });
      }
    }
  }, [user, nav]);

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

        {/* Submit */}
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