import { StepLocation, validateLocation } from "./steps/StepLocation";
import { StepAdditional, validateAdditionalInfo } from "./steps/StepAdditionalInfo";
import { StepServices, validateServices } from "./steps/StepServices";
import StepAccountType, { validateAccountType } from "./steps/StepAccountType";
import { StepPersonalInfo, validatePersonalInfo } from "./steps/StepPersonalInfo";
import StepPhotos, { validatePhotos } from "./steps/StepPhotos";
import { StepReview } from "./steps/StepReview";
import { useOnboardingStore } from "../../store/useOnboardingStore";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

export default function OnBoarding() {
  const [validationErrors, setValidationErrors] = useState({});
  const {
    step,
    setStep,
    formData,
    updateSection,
    updatePhotos,
    setAccountType,
    totalSteps,
  } = useOnboardingStore();

  // ✅ Extract userId from localStorage (same as in handleSubmit)
  const authUser = JSON.parse(localStorage.getItem("user"));
  const userId = authUser?._id;  // Assuming _id is the MongoDB ID; adjust if different (e.g., id)

  const validateStep = () => {
  let errors = {};
  switch (step) {
    case 1:
      errors = validatePersonalInfo(formData.personal || {});
      setValidationErrors(errors);
      return Object.keys(errors).length === 0;
    case 2:
      errors = validateLocation(formData.location || {});
      setValidationErrors(errors);
      return Object.keys(errors).length === 0;
    case 3:
      errors = validateAdditionalInfo(formData.additional || {});
      setValidationErrors(errors);
      return Object.keys(errors).length === 0;
      case 4:
      errors = validateServices(formData.services || {});
      setValidationErrors(errors);
      return Object.keys(errors).length === 0;
    case 5:
      errors = validateAccountType(formData.accountType || {});
      setValidationErrors(errors);
      return Object.keys(errors).length === 0;
    case 6:
      errors = validatePhotos(formData.photos || [], formData.accountType);
      setValidationErrors(errors);
      return Object.keys(errors).length === 0;
    default:
      return true;
  }
};


  // ✅ Go to next step
  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  // ✅ Go to previous step
  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  // ✅ Submit to backend
const handleSubmit = async () => {
  try {
    // ✅ Pre-submit: Run ALL validators to catch frontend issues
    const allErrors = {};
    // Personal
    const personalErrors = validatePersonalInfo(formData.personal || {});
    Object.assign(allErrors, personalErrors);
    // Location
    const locationErrors = validateLocation(formData.location || {});
    Object.assign(allErrors, locationErrors);
    // Additional
    const additionalErrors = validateAdditionalInfo(formData.additional || {});
    Object.assign(allErrors, additionalErrors);
    // Services
    const servicesErrors = validateServices(formData.services || {});
    Object.assign(allErrors, servicesErrors);
    // Account Type
    const accountTypeErrors = validateAccountType(formData.accountType || {});
    Object.assign(allErrors, accountTypeErrors);
    // Photos
    const photosErrors = validatePhotos(formData.photos || [], formData.accountType);
    Object.assign(allErrors, photosErrors);

    if (Object.keys(allErrors).length > 0) {
      console.warn('⚠️ Validation failed - blocking submit:', allErrors);
      toast.error('Please fix errors before submitting.');
      return;
    }

    const fd = new FormData();

    // Ensure username from authUser
    const authUser = JSON.parse(localStorage.getItem("user"));
    if (authUser?.username) {
      fd.append("personal[username]", authUser.username);
    }

    // Personal
    Object.entries(formData.personal || {}).forEach(([key, value]) => {
      fd.append(`personal[${key}]`, value);
    });

    // Location
    Object.entries(formData.location || {}).forEach(([key, value]) => {
      fd.append(`location[${key}]`, value);
    });

    // Additional
    Object.entries(formData.additional || {}).forEach(([key, value]) => {
      fd.append(`additional[${key}]`, value);
    });

    // Services
    if (Array.isArray(formData.services?.selected)) {
      formData.services.selected.forEach((s, i) =>
        fd.append(`services[selected][${i}]`, s)
      );
    }
    if (formData.services?.custom) {
      fd.append("services[custom]", formData.services.custom);
    }

    // AccountType
    Object.entries(formData.accountType || {}).forEach(([key, value]) => {
      fd.append(`accountType[${key}]`, value);
    });

    // Photos
    if (Array.isArray(formData.photos)) {
      formData.photos.forEach((photo) => {
        if (photo instanceof File) {
          fd.append("photos", photo);
        }
      });
    } 

    // ✅ LOG THE FULL PAYLOAD (FormData can't be JSON.stringified, so iterate)
    console.log('🔍 FormData Entries Being Sent:');
    for (let [key, value] of fd.entries()) {
      console.log(`  ${key}:`, value instanceof File ? `[File: ${value.name}, size: ${value.size}]` : value);
    }

    // ✅ Check token
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error('No auth token found - cannot submit');
    }
    console.log('🔑 Token present:', token ? 'Yes' : 'No');

    // TODO: Test without files? Uncomment below for JSON-only (no multipart)
    // const profileData = { personal: formData.personal, /* ... other sections */ };
    // const res = await axios.put("http://localhost:5000/api/users/profile", profileData, {
    //   headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    // });

    // Send request (multipart for files)
    const res = await axios.put("http://localhost:5000/api/users/profile", fd, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("✅ Profile submitted successfully", res.data);
    toast.success("Profile submitted successfully!"); // Use toast instead of alert for better UX
    // Optional: Navigate or reset store
  } catch (err) {
    // ✅ DETAILED ERROR LOGGING
    console.error('💥 Full Error Details:', {
      message: err.message,
      status: err.response?.status, // Should be 500
      backendError: err.response?.data, // KEY: Server message, e.g., { error: "Invalid services" }
      backendStack: err.response?.data?.stack, // If exposed
      headers: err.response?.headers,
      requestConfig: {
        method: err.config?.method,
        url: err.config?.url,
        headers: err.config?.headers,
      },
      // Re-log FormData if needed (but it's mutated, so from above)
    });
    toast.error(`Submit failed: ${err.response?.data?.error || err.message || 'Unknown error'}`);
  }
};


  // ✅ Steps array
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
    const updated = { ...formData.additional, ...d };
    updateSection("additional", d);
    const errors = validateAdditionalInfo(updated);
    setValidationErrors(errors);
  }}
  errors={validationErrors}
/>
,
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
    setAccountType(d);
    setValidationErrors(validateAccountType(d));
  }}
  errors={validationErrors}
/>
,
    <StepPhotos
  key="photos"
  data={formData.photos}
  updateData={(photos) => {
    updatePhotos(photos);
    setValidationErrors(validatePhotos(photos, formData.accountType));
  }}
  accountType={formData.accountType}
  userId={userId}  
/>
,
    <StepReview key="review" formData={formData} />,
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="bg-white shadow-lg rounded-2xl p-6 md:p-10 w-full max-w-4xl">
        {/* ✅ Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm font-medium text-gray-600 mb-2">
            <span>
              Step {step} of {totalSteps}
            </span>
            <span>{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-pink-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* ✅ Current Step */}
        {steps[step - 1]}

        {/* ✅ Navigation Buttons */}
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
  className={`px-6 py-3 rounded-xl text-white transition-colors  ${
    Object.keys(validationErrors).length === 0
      ? "bg-pink-600 hover:bg-pink-700"
      : "bg-gray-300 cursor-not-allowed"
  }`}
>
  Next
</button>

) : (
  <button
    onClick={handleSubmit}
    className="px-6 py-3 cursor-pointer rounded-xl bg-pink-600 text-white hover:bg-pink-700 transition-colors"
  >
    Submit
  </button>
)}

        </div>
      </div>
    </div>
  );
}