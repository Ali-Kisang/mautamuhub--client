import { useEffect, useState } from "react";
import api from "../utils/axiosInstance";
import { useAuthStore } from "../store/useAuthStore";

import { useNavigate } from "react-router-dom";
import OnlineUsersList from "./OnlineUsersList";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyProfile = async () => {
      if (!user?._id) {
        setError("You are not logged in.");
        setLoading(false);
        return;
      }
      try {
        const res = await api.get("/users/get-profile");
        setProfile(res.data);
      } catch (err) {
        console.error("Fetch profile error:", err);
        setError("Could not load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchMyProfile();
  }, [user?._id]);

  const handleSelectUser = (selectedUser) => {
    // Navigate to chat page for that user
    navigate(`/chat/${selectedUser.userId}`);
  };

  if (loading) {
    return <p className="p-6 text-center">⏳ Loading your profile...</p>;
  }

  if (error) {
    return <p className="p-6 text-center text-red-500">{error}</p>;
  }

  if (!profile) {
    return <p className="p-6 text-center text-gray-600">Profile not found.</p>;
  }

  return (
    <div className="flex h-screen">
      {/* 👉 Left Sidebar: Online Users */}
      <aside className="w-72 border-r bg-white hidden md:block">
        <OnlineUsersList onSelectUser={handleSelectUser} />
      </aside>

      {/* 👉 Main Content: Profile Details */}
      <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">My Profile</h1>
          <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
            {/* Personal */}
            <h2 className="text-xl font-semibold">👤 Personal Info</h2>
            <p><strong>Username:</strong> {profile.personal?.username}</p>
            <p><strong>Phone:</strong> {profile.personal?.phone}</p>
            <p><strong>Gender:</strong> {profile.personal?.gender}</p>
            <p><strong>Age:</strong> {profile.personal?.age}</p>
            <p><strong>Ethnicity:</strong> {profile.personal?.ethnicity}</p>
            <p><strong>Orientation:</strong> {profile.personal?.orientation}</p>

            {/* Location */}
            <h2 className="text-xl font-semibold mt-6">📍 Location</h2>
            <p>
              {profile.location?.localArea}, {profile.location?.ward},{" "}
              {profile.location?.constituency}, {profile.location?.county}
            </p>

            {/* Rates */}
            <h2 className="text-xl font-semibold mt-6">💲 Rates</h2>
            <p>Incall: Ksh {profile.additional?.incallRate}</p>
            <p>Outcall: Ksh {profile.additional?.outcallRate}</p>

            {/* Description */}
            <h2 className="text-xl font-semibold mt-6">📝 Description</h2>
            <p className="text-gray-700">{profile.additional?.description}</p>

            {/* Services */}
            {profile.services?.selected?.length > 0 && (
              <>
                <h2 className="text-xl font-semibold mt-6">✅ Services</h2>
                <ul className="list-disc ml-6 space-y-1">
                  {profile.services.selected.map((service, i) => (
                    <li key={i}>{service}</li>
                  ))}
                </ul>
              </>
            )}

            {/* Photos */}
            {profile.photos && profile.photos.length > 0 && (
              <>
                <h2 className="text-xl font-semibold mt-6">📸 Photos</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {profile.photos.map((publicId, i) => (
                    <img
                      key={i}
                      src={`https://res.cloudinary.com/dcxggvejn/image/upload/${publicId}`}
                      alt={`photo-${i}`}
                      className="w-full h-40 object-cover rounded-lg shadow"
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
