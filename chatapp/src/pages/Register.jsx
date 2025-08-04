// 📌 Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const nav = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      nav("/login");
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 to-purple-300">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-96 space-y-3">
        <h2 className="text-2xl font-bold mb-4 text-center text-pink-600">Create Account</h2>
        <input type="text" name="username" value={form.username} onChange={handleChange} placeholder="Username" className="w-full p-2 border rounded"/>
        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded"/>
        <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" className="w-full p-2 border rounded"/>
        <button type="submit" className="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600">Register</button>
        <p className="text-center text-sm">Already have an account? <Link to="/login" className="text-pink-600 font-semibold">Login</Link></p>
      </form>
    </div>
  );
}