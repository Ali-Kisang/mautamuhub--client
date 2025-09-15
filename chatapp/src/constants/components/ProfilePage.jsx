import { useEffect, useState } from "react";
import axios from "axios";
import { Camera, Trash2 } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { server } from "../../server";
import { useNavigate } from "react-router-dom";
import { Info } from "lucide-react";
const ProfilePage = () => {
  const { authUser, onlineUsers } = useAuthStore();

  
  const navigate = useNavigate();
  const [escortData, setEscortData] = useState(null);
  const [editableServices, setEditableServices] = useState([]);
  const [formData, setFormData] = useState({
    phoneNumber: "",
    gender: "",
    sexualOrientation: "",
    ethnicity: "",
  });

  const [editableLocation, setEditableLocation] = useState({
    county: "",
    constituency: "",
    ward: "",
    localArea: "",
    roadStreet: "",
  });

  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [newPhotos, setNewPhotos] = useState([]);

  useEffect(() => {
    if (!authUser?._id) return;
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${server}/escorts/user-profile/${authUser._id}`
        );

        setEscortData(res.data);
        setEditableLocation(res.data.breadcrumbLocation || {});
        setEditableServices(res.data.services || []);
        setSelectedPhotos(res.data.photos || []);

        setFormData({
          phoneNumber: res.data.personalInfo?.phoneNumber || "",
          gender: res.data.personalInfo?.gender || "",
          sexualOrientation: res.data.personalInfo?.sexualOrientation || "",
          ethnicity: res.data.personalInfo?.ethnicity || "",
          username: res.data.personalInfo?.username || "",
        });
      } catch (err) {
        console.error("Failed to fetch escort data", err);
      }
    };
    fetchData();
  }, [authUser]);

  const isMissingProfileInfo =
    !editableLocation?.county ||
    editableServices.length === 0 ||
    !formData.phoneNumber ||
    !formData.gender ||
    !formData.sexualOrientation ||
    !formData.ethnicity;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    const newImagePreviews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setNewPhotos([...newPhotos, ...newImagePreviews]);
  };

  const handleRemoveExistingPhoto = (photoUrl) => {
    setSelectedPhotos((prev) => prev.filter((url) => url !== photoUrl));
  };

  const handleRemoveNewPhoto = (previewUrl) => {
    setNewPhotos((prev) => prev.filter((img) => img.preview !== previewUrl));
  };

  const handleSubmit = async () => {
  const formDataPayload = new FormData();

  selectedPhotos.forEach((photo) =>
    formDataPayload.append("existingPhotos", photo)
  );
  newPhotos.forEach(({ file }) => formDataPayload.append("newPhotos", file));
  formDataPayload.append(
    "breadcrumbLocation",
    JSON.stringify(editableLocation)
  );
  formDataPayload.append("services", JSON.stringify(editableServices));

  // Add the first image as profilePic
  formDataPayload.append("profilePic", selectedPhotos[0] || "");

  try {
    await axios.put(
      `${server}/escorts/user-profile/${authUser._id}`,
      formDataPayload,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    alert("Profile updated successfully");
  } catch (err) {
    console.error("Error updating profile:", err);
    alert("Failed to update profile");
  }
};


  const accountType = escortData?.accountType;

  return (
    <div className="max-w-4xl  mx-auto px-4 py-10 space-y-8">
      {/* Heading */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl text-pink font-bold">Your Profile</h1>
        <p className="text-gray-500">Manage your profile {authUser?.fullName}</p>
        <div className="flex justify-center">
  <div className="relative w-24 h-24">
    <div className="avatar">
      <div className="w-24 rounded-full ring ring-pink-500 ring-offset-2">
<img
        src={
  selectedPhotos.length > 0
    ? `https://res.cloudinary.com/dcxggvejn/image/upload/${selectedPhotos[0]}`
    : authUser?.profilePic || "/avatar.png"
}
/>
      </div>
    </div>
    {onlineUsers?.includes(authUser._id) && (
      <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white" />
    )}
  </div>
</div>



      </div>

      {/* User Info */}
      <div className="bg-base-200 p-6 rounded-lg space-y-4">
        <h2 className="font-semibold text-lg underline">Your Profile Info</h2>
        <div>
          <p className="font-semibold">Full Name:</p>
          <p className="text-gray-700">{authUser?.fullName || "N/A"}</p>
        </div>
        <div>
          <p className="font-semibold">Email:</p>
          <p className="text-gray-700">{authUser?.email || "N/A"}</p>
         
        </div>
      </div>

      {isMissingProfileInfo ? (
        <div className="text-center mt-8">
          <div className="flex items-start gap-2 text-sm text-gray-500">
    <Info className="mt-0.5" size={16} />
    <p>
      You are using this account to chat only. To access more features such as
      creating a profile and being listed, please upgrade your account.
    </p>
  </div>
          <button
            className="btn btn-primary px-6"
            onClick={() => navigate("/get-started")}
          >
            Create Account
          </button>
        </div>
      ) : (
        <>
          {/* Personal Info */}
          <div className="grid md:grid-cols-2 gap-6 bg-base-200 p-6 rounded-lg">
            <div>
              <label className="font-semibold block mb-1" htmlFor="phoneNumber">
                Phone Number:
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="text"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1" htmlFor="gender">
                Gender:
              </label>
              <input
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label
                className="font-semibold block mb-1"
                htmlFor="sexualOrientation"
              >
                Orientation:
              </label>
              <input
                id="sexualOrientation"
                name="sexualOrientation"
                type="text"
                value={formData.sexualOrientation}
                onChange={handleInputChange}
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1" htmlFor="ethnicity">
                Ethnicity:
              </label>
              <input
                id="ethnicity"
                name="ethnicity"
                type="text"
                value={formData.ethnicity}
                onChange={handleInputChange}
                className="input input-bordered w-full"
              />
            </div>
          </div>

          {/* Location */}
          <div className="bg-base-200 p-6 rounded-lg space-y-4">
            <h2 className="font-semibold text-lg">Location</h2>
            {Object.entries(editableLocation).map(([key, value]) => (
              <div key={key}>
                <label
                  className="block font-semibold capitalize mb-1"
                  htmlFor={key}
                >
                  {key.replace(/([A-Z])/g, " $1")}
                </label>
                <input
                  id={key}
                  type="text"
                  value={value || ""}
                  onChange={(e) =>
                    setEditableLocation((prev) => ({
                      ...prev,
                      [key]: e.target.value,
                    }))
                  }
                  className="input input-bordered w-full"
                />
              </div>
            ))}
          </div>

          {/* Account Info */}
          <div className="bg-base-200 p-6 rounded-lg space-y-2">
            <h2 className="font-semibold text-lg">Account</h2>
            <p>Type: {accountType?.type || "N/A"}</p>
            <p>Amount: KES {accountType?.amount || 0}</p>
          </div>

          {/* Services */}
          <div className="bg-base-200 p-6 rounded-lg">
            <h2 className="font-semibold text-lg mb-2">Services Offered</h2>
            <div className="flex flex-wrap gap-2 mb-3">
              {editableServices.map((service, index) => (
                <div
                  key={index}
                  className="badge badge-outline flex items-center space-x-2"
                >
                  <span>{service}</span>
                  <button
                    onClick={() =>
                      setEditableServices((prev) =>
                        prev.filter((_, i) => i !== index)
                      )
                    }
                    className="btn btn-xs btn-error btn-circle"
                    aria-label="Remove service"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            <input
              type="text"
              placeholder="Add a new service"
              className="input input-bordered w-full max-w-xs"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.value.trim()) {
                  e.preventDefault();
                  setEditableServices((prev) => [
                    ...prev,
                    e.target.value.trim(),
                  ]);
                  e.target.value = "";
                }
              }}
            />
            <p className="text-sm text-gray-500 mt-1">
              Press Enter to add a service
            </p>
          </div>

          {/* Photo Gallery */}
          <div className="bg-base-200 p-6 rounded-lg">
            <h2 className="font-semibold text-lg mb-4">Photo Gallery</h2>
            <div className="flex flex-wrap gap-4 mb-4">
              {selectedPhotos.map((photo, index) => (
                <div key={index} className="relative w-32 h-32">
                  <img
                    src={`https://res.cloudinary.com/dcxggvejn/image/upload/${photo}`}
                    alt={`photo-${index}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    onClick={() => handleRemoveExistingPhoto(photo)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 mb-4">
              {newPhotos.map((img, index) => (
                <div key={index} className="relative w-32 h-32">
                  <img
                    src={img.preview}
                    alt="preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    onClick={() => handleRemoveNewPhoto(img.preview)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <label className="btn btn-outline btn-primary cursor-pointer">
              <Camera className="mr-2" />
              Upload Photo(s)
              <input
                type="file"
                className="hidden"
                multiple
                accept="image/*"
                onChange={handlePhotoChange}
              />
            </label>
          </div>

          {/* Save Button */}
          <div className="text-center">
            <button className="btn btn-success px-6" onClick={handleSubmit}>
              Update Profile
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
