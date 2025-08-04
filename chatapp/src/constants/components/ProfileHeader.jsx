import { useState } from "react";
import { Camera, Mail, User } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  // Show loading state if authUser is not yet available
  if (!authUser) {
    return (
      <div className="h-screen flex justify-center items-center">
        <p className="text-lg text-gray-500">Loading profile...</p>
      </div>
    );
  }

  // Function to handle profile picture upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create a local URL for instant preview
    const imageUrl = URL.createObjectURL(file);
    setSelectedImg(imageUrl);

    const formData = new FormData();
    formData.append("profilePic", file);

    await updateProfile(formData);

    // Optionally, revoke the object URL after upload
    URL.revokeObjectURL(imageUrl);
  };

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          {/* Header Section */}
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2 text-gray-500">Your profile information</p>
          </div>

          {/* Profile Picture Upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser?.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4"
              />
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer transition-all duration-200
                  ${
                    isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                  }
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-gray-400">
              {isUpdatingProfile
                ? "Uploading..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>

          {/* User Details */}
          <div className="space-y-6">
            {/* Full Name */}
            <div className="space-y-1.5">
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <User className="w-4 h-4" />
                Username
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.fullName || "Not provided"}
              </p>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.email || "Not provided"}
              </p>
            </div>
          </div>

          {/* Account Information */}
          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-gray-700">
                <span>Member Since</span>
                <span>{authUser?.createdAt?.split("T")[0] || "N/A"}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
