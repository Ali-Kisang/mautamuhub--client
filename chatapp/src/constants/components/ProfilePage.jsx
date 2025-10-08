import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import api from "../utils/axiosInstance";
import { useAuthStore } from "../store/useAuthStore";
import ProfileLayout from "./ProfileLayout";
import { DotStream } from "ldrs/react";

// Lucide icons
import { User, MapPin, Phone, Heart, DollarSign, Camera, PlusCircle, AlertTriangle, Edit2, ArrowUpRight, Clock, Crown } from "lucide-react";
// Material Design icon
import { MdVerified } from "react-icons/md";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cld = new Cloudinary({
    cloud: { cloudName: "dcxggvejn" },
  });

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

  // ✅ New: Calculate days left from expiryDate
  const getDaysLeft = (expiryDate) => {
    if (!expiryDate) return null;
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const getAvatarUrl = (avatar) => {
    if (!avatar) return "/default-avatar.png";
    return `https://res.cloudinary.com/dcxggvejn/image/upload/${avatar}`;
  };

  const isVerified = profile?.accountType?.type === "VVIP" || profile?.accountType?.type === "Spa";
  const accountType = profile?.accountType?.type || "Regular";
  const isTrial = profile?.isTrial || false;
  const daysLeft = getDaysLeft(profile?.expiryDate);
  const isExpiringSoon = daysLeft > 0 && daysLeft <= 3 && isTrial;  // Warn for trials only
  const isExpired = profile?.active === false;  // Backend sets active: false on expiry

  const getAccountBadgeClass = (type) => {
    switch (type) {
      case "Spa": return "bg-purple-100 text-purple-800 border-purple-300";
      case "VVIP": return "bg-indigo-100 text-indigo-800 border-indigo-300";
      case "VIP": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Regular": return "bg-gray-100 text-gray-800 border-gray-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  // ✅ New: Badge text with trial indicator
  const getBadgeText = () => {
    let text = `${accountType} Account`;
    if (isTrial) text += " (Trial)";
    if (daysLeft !== null && daysLeft > 0) text += ` – ${daysLeft} days left`;
    return text;
  };

  return (
    <ProfileLayout>
      {loading && (
        <div className="flex flex-col items-center justify-center h-64 gap-2" role="status" aria-live="polite">
          <l-dot-stream size="60" speed="2.5" color="#ec4899"></l-dot-stream>
          <p className="text-pink-500 font-medium">Loading your profile...</p>
        </div>
      )}

      {error && (
        <div className="p-6 text-center text-red-500" role="alert">
          {error}
        </div>
      )}

      {/* 🔹 If no profile, show user fallback */}
      {!loading && !error && !profile && user && (
        <>
          {/* Banner */}
          <div className="bg-gradient-to-r from-pink-200 to-pink-500 h-48 relative">
            <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
              <img
                src={getAvatarUrl(user.avatar)}
                alt={`${user.username}'s avatar`}
                className="w-36 h-36 rounded-full border-4 border-pink-500 shadow-lg object-cover"
                loading="lazy"
              />
              <h1 className="mt-6 text-2xl md:text-3xl font-bold text-gray-800 text-center">
                {user.username}
              </h1>
              <p className="mt-1 text-gray-600 text-center">{user.email}</p>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-5xl mx-auto mt-28 space-y-6 p-4 text-center">
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <p className="text-gray-600 mb-4 flex items-center justify-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" aria-hidden="true" />
                You are not listed yet. Create one to unlock full features. This account is currently limited to chatting only.
              </p>
              <Link
                to="/create-account"
                className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg shadow hover:bg-pink-600 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-300"
                aria-label="Activate your account to get listed"
              >
                <PlusCircle size={18} />
                Activate Your Account
              </Link>
            </div>
          </div>
        </>
      )}

      {/* 🔹 If profile exists but expired, show expiry banner */}
      {profile && isExpired && (
        <div className="max-w-5xl mx-auto mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-center">
          <p className="text-red-800 flex items-center justify-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5" aria-hidden="true" />
            Your {accountType} {isTrial ? 'trial' : 'subscription'} has expired. Upgrade to reactivate your profile!
          </p>
          <Link
            to="/upgrade-account"
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
            aria-label="Upgrade to reactivate"
          >
            <ArrowUpRight size={18} />
            Upgrade Now
          </Link>
        </div>
      )}

      {/* 🔹 If profile active but expiring soon (trials only), show warning banner */}
      {profile && !isExpired && isExpiringSoon && (
        <div className="max-w-5xl mx-auto mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <p className="text-yellow-800 flex items-center justify-center gap-2">
            <Clock className="w-5 h-5" aria-hidden="true" />
            Your trial ends in {daysLeft} day{daysLeft !== 1 ? 's' : ''}. Upgrade to keep your {accountType} features!
          </p>
          <Link
            to="/upgrade-account"
            className="inline-flex items-center gap-1 mt-2 px-3 py-1 text-sm bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-300 ml-auto"
            aria-label="Upgrade before expiry"
          >
            <ArrowUpRight size={14} />
            Upgrade Now
          </Link>
        </div>
      )}

      {/* 🔹 If profile exists and active, show profile data */}
      {profile && !isExpired && (
        <>
          {/* Banner */}
          <div className="bg-gradient-to-r from-pink-200 to-pink-500 h-48 relative">
            <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
              <div className="relative">
                {profile.photos && profile.photos.length > 0 ? (
                  <>
                    <AdvancedImage
                      cldImg={cld
                        .image(profile.photos[0])
                        .resize(auto().gravity(autoGravity()))}
                      className="w-36 h-36 rounded-full border-4 border-pink-500 shadow-lg object-cover hover:scale-105 transition-transform duration-200"
                      alt={`${profile.personal?.username}'s profile photo`}
                    />
                    {isVerified && (
                      <div className="absolute top-3 left-3">
                        <MdVerified className="text-pink-500 text-xl" />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-36 h-36 rounded-full border-4 border-pink-500 shadow-lg bg-gray-200 flex items-center justify-center">
                    No Photo
                  </div>
                )}
              </div>
              <h1 className="mt-6 text-2xl md:text-3xl font-bold text-gray-800 text-center">
                {profile.personal?.username}
              </h1>
              <p className="mt-1 text-gray-600 text-center">
                {profile.personal?.age} yrs · {profile.personal?.gender}
              </p>
              <p className="text-gray-500 flex items-center justify-center gap-1 text-center">
                <MapPin size={16} aria-hidden="true" /> {profile.location?.county},{" "}
                {profile.location?.constituency}
              </p>
            </div>
          </div>

          {/* Profile content */}
          <div className="max-w-5xl mx-auto mt-28 space-y-6 p-4">
            {/* Edit CTA */}
            <div className="text-right">
              <Link
                to="/edit-profile"
                className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-pink-100 text-pink-700 rounded-md hover:bg-pink-200 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-300"
                aria-label="Edit your profile"
              >
                <Edit2 size={14} />
                Edit Profile
              </Link>
            </div>

            {/* Account Type Badge */}
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <h2 className="text-xl md:text-2xl font-semibold mb-4 flex items-center gap-2">
                <Crown className="text-pink-500" size={25} aria-hidden="true" /> Account Type
              </h2>
              <div className="flex items-center justify-center gap-4">
                <span className={`px-4 py-2 rounded-full border font-semibold flex items-center gap-2 ${getAccountBadgeClass(accountType)}`}>
                  {isVerified && <MdVerified className="w-4 h-4 text-pink-500" />}
                  {getBadgeText()}
                </span>
              </div>
              {!isVerified && !isTrial && (
                <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                  <p className="text-yellow-800 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" aria-hidden="true" />
                    You're not verified. Upgrade to VIP or VVIP for better visibility and priority features!
                  </p>
                  <Link
                    to="/upgrade-account"
                    className="inline-flex items-center gap-1 mt-2 px-3 py-1 text-sm bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-300"
                    aria-label="Upgrade your account"
                  >
                    <ArrowUpRight size={14} />
                    Upgrade Now
                  </Link>
                </div>
              )}
              {isTrial && (
                <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                  <p className="text-blue-800 flex items-center gap-2">
                    <Clock className="w-5 h-5" aria-hidden="true" />
                    Enjoying your free trial? Upgrade anytime to continue without interruptions.
                  </p>
                  <Link
                    to="/upgrade-account"
                    className="inline-flex items-center gap-1 mt-2 px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
                    aria-label="Upgrade from trial"
                  >
                    <ArrowUpRight size={14} />
                    Upgrade to Full
                  </Link>
                </div>
              )}
            </div>

            {/* Personal Info */}
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <h2 className="text-xl md:text-2xl font-semibold mb-4 flex items-center gap-2">
                <User className="text-pink-500" size={25} aria-hidden="true" /> Personal Info
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                <p>
                  <span className="font-medium flex items-center gap-1">
                    <Phone size={16} aria-hidden="true" /> Phone:
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
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <h2 className="text-xl md:text-2xl font-semibold mb-4 flex items-center gap-2">
                <DollarSign className="text-pink-500" size={25} aria-hidden="true" /> Rates
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
              <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <h2 className="text-xl md:text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Heart size={25} className="text-pink-500" aria-hidden="true" /> Services
                </h2>
                <div className="flex flex-wrap gap-2">
                  {profile.services.selected.map((service, i) => (
                    <span
                      key={i}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* About Me */}
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <h2 className="text-xl md:text-2xl font-semibold mb-4 flex items-center gap-2">
                <User size={25} className="text-pink-500" aria-hidden="true" /> About Me
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {profile.additional?.description || "No description available."}
              </p>
            </div>

            {/* Photos */}
            {profile.photos && profile.photos.length > 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <h2 className="text-xl md:text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Camera size={25} className="text-pink-500" aria-hidden="true" /> Photos
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {profile.photos.map((publicId, i) => (
                    <div
                      key={i}
                      className="relative overflow-hidden rounded-lg shadow aspect-square bg-gray-100"
                    >
                      <AdvancedImage
                        cldImg={cld
                          .image(publicId)
                          .resize(auto().gravity(autoGravity()))}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                        alt={`${profile.personal?.username}'s photo ${i + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-500">
                No photos uploaded yet.
              </div>
            )}
          </div>
        </>
      )}
    </ProfileLayout>
  );
}