import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { showToast } from "../toast/showToast";
import { TailSpin } from "react-loader-spinner";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline"; // install: npm i @heroicons/react

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const nav = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("username", form.username);
      fd.append("email", form.email);
      fd.append("password", form.password);
      if (avatar) fd.append("avatar", avatar);

      await axios.post("http://localhost:5000/api/auth/register", fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      showToast("Registration successful! Please login.", false);
      nav("/login");
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.error || "Registration failed. Please try again.", true);
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
          Create Account
        </h2>

        {/* Avatar Preview */}
        <div className="flex flex-col items-center space-y-2">
          <label
            htmlFor="avatar"
            className="cursor-pointer relative w-24 h-24 rounded-full overflow-hidden border-4 border-pink-300 shadow-md hover:shadow-lg transition-all"
          >
            {preview ? (
              <img
                src={preview}
                alt="Avatar Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-pink-100 text-pink-500 text-sm">
                Upload
              </div>
            )}
            <input
              type="file"
              id="avatar"
              name="avatar"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          <p className="text-xs text-pink-500">Click to choose avatar</p>
          {/*Warning that this avatar will be used for your chat */}
          <p className="text-xs text-red-500  "> <span className="text-red-700 text-sm  mr-1">*</span>Your Avatar will be used for chat </p>
        </div>

        {/* Username */}
        <input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Username"
          className="w-full p-3 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
          required
        />

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

        {/* Password with toggle */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-3 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 flex items-center text-pink-500 hover:text-pink-600"
          >
            {showPassword ? (
              <EyeOffIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full flex items-center justify-center hover:cursor-pointer bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-lg font-semibold transition duration-200"
          disabled={loading}
        >
          {loading ? (
            <TailSpin  height={24} width={24} color="#fff" />
          ) : (
            "Register"
          )}
        </button>

        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-pink-600 font-semibold hover:underline ">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
