// src/pages/ProfilePage.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/axiosInstance";
import { useAuthStore } from "../store/useAuthStore";
import ProfileLayout from "./ProfileLayout";
import { DotStream } from "ldrs/react";

// Lucide icons
import { User, MapPin, Phone, Heart, DollarSign, Camera, PlusCircle, AlertTriangle } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileStatus = async () => {
      if (!user?._id) {
        setError("You are not logged in.");
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/users/check-profile");
        if (res.data.hasProfile) {
          setProfile(res.data.profile);
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error("Check profile error:", err);
        setError("Could not check profile status");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileStatus();
  }, [user?._id]);
const getAvatarUrl = (avatar) => {
  if (!avatar) return "/default-avatar.png";
  return `https://res.cloudinary.com/dcxggvejn/image/upload/${avatar}`;
};

  return (
    <ProfileLayout>
      {loading && (
  <div className="flex flex-col items-center justify-center h-64 gap-2">
    <l-dot-stream size="60" speed="2.5" color="#ec4899"></l-dot-stream>
    <p className="text-pink-500 font-medium">Loading your profile...</p>
  </div>
)}

      {error && <p className="p-6 text-center text-red-500">{error}</p>}

      {/* 🔹 If no profile, show user fallback */}
      {!loading && !error && !profile && user && (
        <>
          {/* Banner */}
          <div className="bg-gradient-to-r from-pink-200 to-pink-500 h-48 relative">
            <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
              <img
  src={getAvatarUrl(user.avatar)}
  alt="User avatar"
  className="w-36 h-36 rounded-full border-4 border-pink-500 shadow-lg object-contain"
/>
              <h1 className="mt-6 text-2xl md:text-3xl font-bold text-gray-800 text-center">
                {user.username}
              </h1>
              <p className="mt-1 text-gray-600 text-center">{user.email}</p>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-5xl mx-auto mt-28 space-y-6 p-4 text-center">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <p className="text-gray-600 mb-4 flex items-center gap-2">
  <AlertTriangle className="w-5 h-5 text-yellow-500" />
  You are not listed yet. Create one to unlock full features. This account is currently limited to chatting only.
</p>
              <Link
                to="/create-account"
                className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg shadow hover:bg-pink-600 transition"
              >
                <PlusCircle size={18} />
                Activate Your Account
              </Link>
            </div>
          </div>
        </>
      )}

      {/* 🔹 If profile exists, show profile data */}
      {profile && (
        <>
          {/* Banner */}
          <div className="bg-gradient-to-r from-pink-200 to-pink-500 h-48 relative">
            <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
              <img
                src={`https://res.cloudinary.com/dcxggvejn/image/upload/${
                  profile.photos?.[0] || "default.jpg"
                }`}
                alt="Profile"
                className="w-36 h-36 rounded-full border-4 border-pink-500 shadow-lg object-contain hover:scale-105 transition-transform"
              />
              <h1 className="mt-6 text-2xl md:text-3xl font-bold text-gray-800 text-center">
                {profile.personal?.username}
              </h1>
              <p className="mt-1 text-gray-600 text-center">
                {profile.personal?.age} yrs · {profile.personal?.gender}
              </p>
              <p className="text-gray-500 flex items-center gap-1 text-center">
                <MapPin size={16} /> {profile.location?.county},{" "}
                {profile.location?.constituency}
              </p>
            </div>
          </div>

          {/* Profile content */}
          <div className="max-w-5xl mx-auto mt-28 space-y-6 p-4">
            {/* Personal Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl md:text-2xl font-semibold mb-4 flex items-center gap-2">
                <User className="text-pink-500" size={25} /> Personal Info
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
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
              <h2 className="text-xl md:text-2xl font-semibold mb-4 flex items-center gap-2">
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
                <h2 className="text-xl md:text-2xl font-semibold mb-4 flex items-center gap-2">
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

            {/* About Me */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl md:text-2xl font-semibold mb-4 flex items-center gap-2">
                <User size={25} className="text-pink-500" /> About Me
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {profile.additional?.description}
              </p>
            </div>

            {/* Photos */}
            {profile.photos && profile.photos.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl md:text-2xl font-semibold mb-4 flex items-center gap-2">
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
        </>
      )}
    </ProfileLayout>
  );
}
