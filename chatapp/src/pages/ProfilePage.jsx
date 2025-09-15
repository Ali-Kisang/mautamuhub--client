import { useEffect, useState } from "react";
import api from "../utils/axiosInstance";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import OnlineUsersList from "./OnlineUsersList";

// 👉 Lucide Icons
import { User, MapPin, Phone, Heart, DollarSign, Camera } from "lucide-react";

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
    <div className="flex h-screen bg-gray-50">
      {/* 👉 Left Sidebar: Online Users */}
      <aside className="w-72 border-r bg-white hidden md:block">
        <OnlineUsersList onSelectUser={handleSelectUser} />
      </aside>

      {/* 👉 Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Banner / Header */}
        <div className="bg-gradient-to-r from-pink-200 to-pink-500 h-48 relative">
          <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
            <img
              src={`https://res.cloudinary.com/dcxggvejn/image/upload/${
                profile.photos?.[0] || "default.jpg"
              }`}
              alt="Profile"
              className="w-36 h-36 rounded-full border-4 border-pink-500   shadow-lg object-contain hover:scale-105 transition-transform"
            />
            <h1 className="mt-6 text-2xl font-bold text-gray-800">
              {profile.personal?.username}
            </h1>
            <p className="mt-1 text-gray-600">
              {profile.personal?.age} yrs · {profile.personal?.gender}
            </p>
            <p className="text-gray-500 flex items-center gap-1">
              <MapPin size={16} /> {profile.location?.county},{" "}
              {profile.location?.constituency}
            </p>
          </div>
        </div>

        {/* Content Cards */}
        <div className="max-w-4xl mx-auto mt-28 space-y-6 p-4">
          {/* Personal Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <User className="text-pink-500" size={25} /> Personal Info
            </h2>
            <div className="grid grid-cols-2 gap-4 text-gray-700">
              <p>
                <span className="font-medium flex items-center gap-1">
                  <Phone size={16} /> Phone:
                </span>{" "}
                {profile.personal?.phone}
              </p>
              <p>
                <span className="font-medium">Ethnicity:</span>{" "}
                {profile.personal?.ethnicity}
              </p>
              <p>
                <span className="font-medium">Orientation:</span>{" "}
                {profile.personal?.orientation}
              </p>
            </div>
          </div>

          {/* Rates */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="text-pink-500" size={25} /> Rates
            </h2>
            <div className="flex flex-wrap gap-3">
              <span className="bg-pink-100 text-pink-500 px-4 py-2 rounded-lg font-medium">
                Incall: Ksh {profile.additional?.incallRate}
              </span>
              <span className="bg-pink-100 text-pink-500 px-4 py-2 rounded-lg font-medium">
                Outcall: Ksh {profile.additional?.outcallRate}
              </span>
            </div>
          </div>

          {/* Services */}
          {profile.services?.selected?.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Heart size={25} className="text-pink-500" /> Services
              </h2>
              <div className="flex flex-wrap gap-2">
                {profile.services.selected.map((service, i) => (
                  <span
                    key={i}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <User size={25} className="text-pink-500" /> About Me
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {profile.additional?.description}
            </p>
          </div>

   {/* Photos */}
{profile.photos && profile.photos.length > 0 && (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
      <Camera size={25} className="text-pink-500" /> Photos
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {profile.photos.map((publicId, i) => (
        <div
          key={i}
          className="w-full h-64 bg-gray-100 rounded-lg shadow flex items-center justify-center overflow-hidden"
        >
          <img
            src={`https://res.cloudinary.com/dcxggvejn/image/upload/${publicId}`}
            alt={`photo-${i}`}
            className="w-full h-full object-contain"
          />
        </div>
      ))}
    </div>
  </div>
)}


        </div>
      </main>
    </div>
  );
}
