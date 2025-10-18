
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";
import { useAuthStore } from "../store/useAuthStore";
import { showToast } from "../components/utils/showToast";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);

  const nav = useNavigate();
  const resetPassword = useAuthStore((s) => s.resetPassword);

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      showToast("Invalid or missing reset token.", true);
      nav("/login", { replace: true });
    }
    // Assume token is valid if present (full validation happens on submit via backend)
    setIsValidToken(true);
  }, [token, nav]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      showToast("Passwords do not match.", true);
      return;
    }
    if (form.newPassword.length < 6) {
      showToast("Password must be at least 6 characters.", true);
      return;
    }
    setLoading(true);
    try {
      await resetPassword({ token, newPassword: form.newPassword });
      showToast("Password reset successful! Redirecting to login...", false);
      setTimeout(() => nav("/login", { replace: true }), 2000);
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || "Failed to reset password.", true);
    } finally {
      setLoading(false);
    }
  };

  if (!isValidToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-pink-300 to-pink-400 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-pink-600 mb-4">Invalid Reset Link</h2>
          <p>Please request a new password reset from the login page.</p>
          <button
            onClick={() => nav("/login")}
            className="mt-4 bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-pink-300 to-pink-400 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-4"
      >
        <h2 className="text-3xl font-extrabold mb-4 text-center text-pink-600">
          Reset Password
        </h2>

        {/* New Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            placeholder="New Password (min 6 chars)"
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

        {/* Confirm Password */}
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm New Password"
            className="w-full p-3 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 pr-12"
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-3 flex items-center text-pink-500 hover:text-pink-700"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
          >
            {showConfirmPassword ? (
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
          className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-lg font-semibold transition duration-200 flex items-center justify-center"
        >
          {loading ? (
            <TailSpin height={24} width={24} color="#fff" />
          ) : (
            "Reset Password"
          )}
        </button>

        <p className="text-center text-sm">
          <Link to="/login" className="text-pink-600 font-semibold hover:underline">
            Back to Login
          </Link>
        </p>
      </form>
    </div>
  );
}