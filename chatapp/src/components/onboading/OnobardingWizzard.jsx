import { StepLocation, validateLocation } from "./steps/StepLocation";
import { StepAdditional, validateAdditionalInfo } from "./steps/StepAdditionalInfo";
import { StepServices, validateServices } from "./steps/StepServices";
import StepAccountType, { validateAccountType } from "./steps/StepAccountType";
import { StepPersonalInfo, validatePersonalInfo } from "./steps/StepPersonalInfo";
import StepPhotos, { validatePhotos } from "./steps/StepPhotos";
import { StepReview } from "./steps/StepReview";
import { useOnboardingStore } from "../../store/useOnboardingStore";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../utils/showToast";
import Footer from "../../pages/Footer";
import api from "../../utils/axiosInstance";

export default function OnBoarding() {
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('idle');  // 'idle' | 'pending' | 'success' | 'failed'
  const [checkoutRequestID, setCheckoutRequestID] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);
  const navigate = useNavigate();
  const {
    step,
    setStep,
    formData,
    updateSection,
    updatePhotos,
    setAccountType,
    totalSteps,
  } = useOnboardingStore();

  // ✅ Extract userId from localStorage
  const authUser = JSON.parse(localStorage.getItem("user"));
  const userId = authUser?._id;

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

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  // Poll for transaction status (unchanged for payments)
  const pollTransactionStatus = async (checkoutRequestId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await api.get("/users/payments/my-transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const transactions = res.data.transactions || [];
      const latestTx = transactions.find(tx => tx.checkoutRequestID === checkoutRequestId);  
      if (!latestTx) return false;

      if (latestTx.status === 'SUCCESS') {
        console.log('🎉 SUCCESS detected!');
        setPaymentStatus('success');
        showToast("Payment successful! Profile updated.", false);
        setIsSubmitting(false);
        setTimeout(() => navigate('/profile'), 2000);
        return true;
      } else if (latestTx.status === 'FAILED' || latestTx.status === 'CANCELLED') {
        console.log('❌ Failure detected:', latestTx.status);
        setPaymentStatus('failed');
        showToast("Payment failed. You can retry below.", true);
        setIsSubmitting(false);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Polling error:", err);
      return false;
    }
  };

  const handleRetry = () => {
    setPaymentStatus('idle');
    setIsSubmitting(false);
    handleSubmit();  // Re-run submit
  };

  // ✅ Submit to backend (updated for trial handling)
  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setPaymentStatus('idle');

    try {
      // Pre-submit: Run ALL validators
      const allErrors = {};
      Object.assign(allErrors, validatePersonalInfo(formData.personal || {}));
      Object.assign(allErrors, validateLocation(formData.location || {}));
      Object.assign(allErrors, validateAdditionalInfo(formData.additional || {}));
      Object.assign(allErrors, validateServices(formData.services || {}));
      Object.assign(allErrors, validateAccountType(formData.accountType || {}));
      Object.assign(allErrors, validatePhotos(formData.photos || [], formData.accountType));

      if (Object.keys(allErrors).length > 0) {
        console.warn('⚠️ Validation failed - blocking submit:', allErrors);
        showToast('Please fix errors before submitting.', true);
        setIsSubmitting(false);
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

      // AccountType (frontend sends type/duration; backend handles amount=0 for trial)
      Object.entries(formData.accountType || {}).forEach(([key, value]) => {
        fd.append(`accountType[${key}]`, value);
      });

      // Photos
      if (Array.isArray(formData.photos)) {
        const photoFiles = formData.photos.filter(photo => photo instanceof File);
        console.log('📸 Photo Files Ready:', photoFiles.length);
        if (photoFiles.length === 0) {
          showToast('No photos selected—add at least one to continue.', true);
          setIsSubmitting(false);
          return;
        }
        photoFiles.forEach((photo) => {
          fd.append("photos", photo);
        });
      } 

      console.log('🔍 FormData Entries Being Sent:');
      for (let [key, value] of fd.entries()) {
        console.log(`  ${key}:`, value instanceof File ? `[File: ${value.name}]` : value);
      }

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error('No auth token found - cannot submit');
      }

      // Send request (multipart for files)
      const res = await api.put("/users/profile", fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("✅ Profile submission response:", res.data);

      // ✅ NEW: Handle trial activation (first-time, no payment)
      if (res.data.trialActive) {
        const type = formData.accountType?.type || 'account';
        showToast(`Free 7-day ${type} trial activated! Welcome aboard.`, false);
        setIsSubmitting(false);
        // Redirect to profile
        setTimeout(() => navigate('/profile'), 1500);
        return;  // Early exit—no polling
      }

      // Existing: If payment required (upgrades)
      if (res.data.requiresPayment) {
        setPaymentStatus('pending');
        setCheckoutRequestID(res.data.checkoutRequestID);
        showToast("Payment initiated! Check your M-Pesa for PIN prompt.", false);
        
        const timeoutIdLocal = setTimeout(() => {
          if (paymentStatus === 'pending') {
            if (intervalId) clearInterval(intervalId);
            setPaymentStatus('failed');
            showToast("Payment timeout. Please try again.", true);
            setIsSubmitting(false);
          }
        }, 300000);  // 5 minutes
        setTimeoutId(timeoutIdLocal);

        const interval = setInterval(async () => {
          if (paymentStatus !== 'pending') {
            clearInterval(interval);
            if (timeoutId) clearTimeout(timeoutId);
            return;
          }
          const success = await pollTransactionStatus(res.data.checkoutRequestID);
          if (success) {
            clearInterval(interval);
            if (timeoutId) clearTimeout(timeoutId);
          }
        }, 5000);

        setIntervalId(interval);
        return;
      }

      // No payment/trial: Generic success
      showToast("Profile submitted successfully!", false);
      setIsSubmitting(false);
      setTimeout(() => navigate('/profile'), 1500);
    } catch (err) {
      console.error('💥 Full Error Details:', {
        message: err.message,
        status: err.response?.status,
        backendError: err.response?.data,
      });
      showToast(`Submit failed: ${err.response?.data?.message || err.message || 'Unknown error'}`, true);
      setIsSubmitting(false);
      setPaymentStatus('idle');
    }
  };

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [intervalId, timeoutId]);

  // Steps array (unchanged, but Review can show trial note if needed)
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
        setAccountType(d);
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
      userId={userId}  
    />,
    <StepReview key="review" formData={formData} />,  // Can add trial note here: "You'll get a free 7-day trial!"
  ];

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center px-4 py-8">
      <div className="bg-white shadow-2xl rounded-2xl p-6 md:p-10 w-full max-w-4xl border border-pink-100">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm font-medium text-gray-600 mb-2">
            <span>
              Step {step} of {totalSteps}
            </span>
            <span>{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-pink-500 to-rose-500 h-2 rounded-full transition-all duration-300"  
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
                  ? "bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700"  
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-6 py-3 rounded-xl text-white transition-colors ${
                isSubmitting
                  ? "bg-gradient-to-r from-pink-400 to-rose-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 cursor-pointer"  
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </div>
              ) : paymentStatus === 'pending' ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Waiting for Payment...
                </div>
              ) : (
                "Submit"
              )}
            </button>
          )}
        </div>

        {/* Payment Status Indicator */}
        {paymentStatus === 'pending' && (
          <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl text-center shadow-md">
            <p className="text-yellow-800 font-medium">⏳ Awaiting payment confirmation. Check your phone and enter M-Pesa PIN.</p>
            <p className="text-sm text-yellow-700 mt-1">Request ID: {checkoutRequestID}</p>
          </div>
        )}
        {paymentStatus === 'failed' && (
          <div className="mt-4 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl text-center shadow-md">
            <p className="text-red-800 font-medium">❌ Payment failed. You can retry below.</p>
            <button
              onClick={handleRetry}
              className="mt-3 px-6 py-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg hover:from-pink-700 hover:to-rose-700 transition-all font-medium"
            >
              🔄 Retry Payment
            </button>
          </div>
        )}
        {paymentStatus === 'success' && (
          <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl text-center shadow-md">
            <p className="text-green-800 font-medium">✅ Payment successful! Redirecting to profile...</p>
          </div>
        )}
      </div>
    </div>
    <Footer/>
     </>
  );
}