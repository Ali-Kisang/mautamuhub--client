// 📌 src/pages/UsersList.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/axiosInstance";
import { useAuthStore } from "../store/useAuthStore";

export default function UsersList() {
  const { user } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/users/all");
        // Filter yourself out
        const filtered = res.data.filter((u) => u._id !== user._id);
        setUsers(filtered);
      } catch (err) {
        console.error("❌ Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?._id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-pink-700 text-xl">
        ⏳ Loading users...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 p-6">
      <h1 className="text-3xl font-bold text-pink-700 mb-6 text-center">
        💌 Browse Profiles
      </h1>

      {users.length === 0 ? (
        <p className="text-center text-gray-600">No other users found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {users.map((u) => (
            <Link
              key={u._id}
              to={`/profile/${u._id}`} // 👈 Go to their profile details page
              className="flex items-center p-4 bg-white rounded-xl shadow hover:shadow-lg transition"
            >
              <img
                src={
                  // If your user model has a profile photo stored somewhere:
                  u.avatar ||
                  u.photo ||
                  "https://via.placeholder.com/50"
                }
                alt={u.username}
                className="w-12 h-12 rounded-full object-cover mr-4"
              />
              <div>
                <p className="font-semibold text-lg">{u.username}</p>
                <p className="text-sm text-gray-500">{u.email}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
