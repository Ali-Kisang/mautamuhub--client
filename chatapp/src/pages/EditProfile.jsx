/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


import { useAuthStore } from "../store/useAuthStore";
import { showToast } from "../toast/showToast";
import api from "../utils/axiosInstance";
import { StepPersonalInfo, validatePersonalInfo } from "../components/onboading/steps/StepPersonalInfo";
import { StepLocation, validateLocation } from "../components/onboading/steps/StepLocation";
import { StepAdditional, validateAdditionalInfo } from "../components/onboading/steps/StepAdditionalInfo";
import { StepServices, validateServices } from "../components/onboading/steps/StepServices";
import StepAccountType, { validateAccountType } from "../components/onboading/steps/StepAccountType";
import StepPhotos, { validatePhotos } from "../components/onboading/steps/StepPhotos";
import { StepReview } from "../components/onboading/steps/StepReview";

// Reuse or adapt Onboarding store if possible; for simplicity, use local state here
export default function EditProfile() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  console.log("user in EditProfile:", user);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    personal: {},
    location: {},
    additional: {},
    services: { selected: [], custom: "" },
    accountType: {},
    photos: [],
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const totalSteps = 7; // Same as onboarding

  // Fetch existing profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?._id) {
        showToast("Please log in to edit your profile.", true);
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        // 👉 Fixed: Added "/users/" prefix to match router mounting (e.g., /api/users/profile)
        const res = await api.get("/users/profile"); // Now resolves to /api/users/profile
        const profile = res.data.profile || res.data; // Adjust based on response structure

        // Map to formData structure
        setFormData({
          personal: {
            username: profile.personal?.username || user.username,
            phone: profile.personal?.phone || "",
            gender: profile.personal?.gender || "",
            age: profile.personal?.age || "",
            complexity: profile.personal?.complexity || "",
            ethnicity: profile.personal?.ethnicity || "",
            orientation: profile.personal?.orientation || "",
            customOrientation: profile.personal?.orientationOther || "", // 👉 Mapped from schema field
          },
          location: profile.location || {},
          additional: profile.additional || {},
          services: profile.services || { selected: [], custom: "" },
          accountType: profile.accountType || { type: "Regular", amount: 0, duration: 0 },
          photos: profile.photos || [], // Existing Cloudinary public IDs (strings)
        });
      } catch (err) {
        console.error("Fetch profile error:", err);
        showToast("Could not load your profile. Please try again.", true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?._id, navigate]);

  const updateSection = (section, updates) => {
    setFormData((prev) => ({ ...prev, [section]: { ...prev[section], ...updates } }));
  };

  const updatePhotos = (photos) => {
    setFormData((prev) => ({ ...prev, photos }));
  };

  const setAccountTypeLocal = (accountType) => {
    setFormData((prev) => ({ ...prev, accountType }));
  };

  const validateStep = () => {
    let errors = {};
    switch (step) {
      case 1:
        errors = validatePersonalInfo(formData.personal || {});
        break;
      case 2:
        errors = validateLocation(formData.location || {});
        break;
      case 3:
        errors = validateAdditionalInfo(formData.additional || {});
        break;
      case 4:
        errors = validateServices(formData.services || {});
        break;
      case 5:
        errors = validateAccountType(formData.accountType || {});
        break;
      case 6:
        errors = validatePhotos(formData.photos || [], formData.accountType);
        break;
      default:
        return true;
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setSaving(true);
  try {
    const fd = new FormData();

    // ✅ Ensure required defaults
    const safePersonal = {
      username: formData.personal?.username || user?.username || "unknown",
      phone: formData.personal?.phone || "N/A",
      gender: formData.personal?.gender || "Not Specified",
      age: formData.personal?.age || 18,
      complexity: formData.personal?.complexity || "",
      ethnicity: formData.personal?.ethnicity || "",
      orientation: formData.personal?.orientation || "",
      orientationOther: formData.personal?.customOrientation || "", // 👉 Mapped back to schema field
    };

    // 🔹 Append personal fields
    Object.entries(safePersonal).forEach(([key, value]) => {
      fd.append(`personal[${key}]`, value);
    });

    // 🔹 Append location
    Object.entries(formData.location || {}).forEach(([key, value]) => {
      fd.append(`location[${key}]`, value || "");
    });

    // 🔹 Append additional info
    Object.entries(formData.additional || {}).forEach(([key, value]) => {
      fd.append(`additional[${key}]`, value || "");
    });

    // 🔹 Append services
    (formData.services?.selected || []).forEach((service, idx) => {
      fd.append(`services[selected][${idx}]`, service || "");
    });
    fd.append(`services[custom]`, formData.services?.custom || "");

    // 🔹 Append account type
    const safeAccountType = {
      type: formData.accountType?.type || "Regular",
      amount: formData.accountType?.amount || 0,
      duration: formData.accountType?.duration || 0,
    };
    Object.entries(safeAccountType).forEach(([key, value]) => {
      fd.append(`accountType[${key}]`, value);
    });

    // 🔹 Append photos (files + existing strings)
    if (Array.isArray(formData.photos)) {
      formData.photos.forEach((photo) => {
        if (photo instanceof File) {
          fd.append("photos", photo); // new upload
        } else if (typeof photo === "string") {
          fd.append("existingPhotos[]", photo); // already saved
        }
      });
    }

    // 🐞 Debug log
    for (let [k, v] of fd.entries()) {
      console.log(k, v);
    }

    // ✅ Submit to backend
    const { data } = await api.put("/users/profile", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    showToast(data?.message || "Profile updated successfully!", false);
  } catch (error) {
    console.error("Update error:", error);
    showToast(
      error.response?.data?.message || "Failed to update profile",
      true
    );
  } finally {
    setSaving(false);
  }
};



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Steps array (adapted for edit mode: pass pre-filled data, optional validation)
  const steps = [
    <StepPersonalInfo
      key="personal"
      data={formData.personal}
      update={(d) => {
        updateSection("personal", d);
        setValidationErrors(validatePersonalInfo({ ...formData.personal, ...d }));
      }}
      errors={validationErrors}
    />,
    <StepLocation
      key="location"
      data={formData.location}
      update={(d) => {
        updateSection("location", d);
        setValidationErrors(validateLocation({ ...formData.location, ...d }));
      }}
      errors={validationErrors}
    />,
    <StepAdditional
      key="additional"
      data={formData.additional}
      update={(d) => {
        updateSection("additional", d);
        setValidationErrors(validateAdditionalInfo({ ...formData.additional, ...d }));
      }}
      errors={validationErrors}
    />,
    <StepServices
      key="services"
      data={formData.services}
      update={(d) => {
        updateSection("services", d);
        setValidationErrors(validateServices({ ...formData.services, ...d }));
      }}
      errors={validationErrors}
    />,
    <StepAccountType
      key="accountType"
      selected={formData.accountType}
      setSelected={(d) => {
        setAccountTypeLocal(d);
        setValidationErrors(validateAccountType(d));
      }}
      errors={validationErrors}
    />,
    <StepPhotos
      key="photos"
      data={formData.photos}
      updateData={(photos) => {
        updatePhotos(photos);
        setValidationErrors(validatePhotos(photos, formData.accountType));
      }}
      accountType={formData.accountType}
    />,
    <StepReview key="review" formData={formData} />,
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="bg-white shadow-lg rounded-2xl p-6 md:p-10 w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-pink-600 mb-2">Edit Your Profile</h1>
          <p className="text-gray-600">Update your details below. Changes will be saved when you submit.</p>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm font-medium text-gray-600 mb-2">
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-pink-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Current Step */}
        {steps[step - 1]}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          {step > 1 ? (
            <button
              onClick={prevStep}
              className="px-6 py-3 rounded-xl bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
            >
              Previous
            </button>
          ) : (
            <div />
          )}

          {step < totalSteps ? (
            <button
              onClick={() => {
                const isValid = validateStep();
                if (isValid) nextStep();
              }}
              className={`px-6 py-3 rounded-xl text-white transition-colors ${
                Object.keys(validationErrors).length === 0
                  ? "bg-pink-600 hover:bg-pink-700"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
              disabled={Object.keys(validationErrors).length > 0}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-pink-600 text-white hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}