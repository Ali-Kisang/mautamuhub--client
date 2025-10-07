import { StepLocation, validateLocation } from "./steps/StepLocation";
import { StepAdditional, validateAdditionalInfo } from "./steps/StepAdditionalInfo";
import { StepServices, validateServices } from "./steps/StepServices";
import StepAccountType, { validateAccountType } from "./steps/StepAccountType";
import { StepPersonalInfo, validatePersonalInfo } from "./steps/StepPersonalInfo";
import StepPhotos, { validatePhotos } from "./steps/StepPhotos";
import { StepReview } from "./steps/StepReview";
import { useOnboardingStore } from "../../store/useOnboardingStore";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";  // ✅ For redirect on success
import { showToast } from "../utils/showToast";

export default function OnBoarding() {
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);  // Loading state for submit
  const [paymentStatus, setPaymentStatus] = useState('idle');  // 'idle' | 'pending' | 'success' | 'failed'
  const [checkoutRequestID, setCheckoutRequestID] = useState(null);  // Track for polling
  const [intervalId, setIntervalId] = useState(null);  // Track interval for cleanup
  const [timeoutId, setTimeoutId] = useState(null);  // Track timeout for cleanup
  const navigate = useNavigate();  // ✅ For redirect on success
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

  // ✅ Poll for transaction status
  const pollTransactionStatus = async (checkoutRequestId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      console.log('🔍 Polling for checkoutRequestID:', checkoutRequestId);
      const res = await axios.get("http://localhost:5000/api/users/payments/my-transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const transactions = res.data.transactions || [];
      console.log('📋 Transactions received:', transactions.map(tx => ({ 
        id: tx._id, 
        checkout: tx.checkoutRequestID, 
        status: tx.status 
      })));

      const latestTx = transactions.find(tx => tx.checkoutRequestID === checkoutRequestId);  
      if (!latestTx) {
        console.log('❌ Transaction not found in response');
        return false;  // Not found yet
      }

      console.log('✅ Found transaction:', { 
        checkoutRequestID: latestTx.checkoutRequestID, 
        status: latestTx.status 
      });

      if (latestTx.status === 'SUCCESS') {
        console.log('🎉 SUCCESS detected!');
        setPaymentStatus('success');
        showToast("Payment successful! Profile updated.", false);
        setIsSubmitting(false);
        // ✅ Redirect to /profile after short delay
        setTimeout(() => navigate('/profile'), 2000);
        return true;  // Signal success to stop interval
      } else if (latestTx.status === 'FAILED' || latestTx.status === 'CANCELLED') {
        console.log('❌ Failure detected:', latestTx.status);
        setPaymentStatus('failed');
        showToast("Payment failed. You can retry below.", true);
        setIsSubmitting(false);
        return true;  // Stop on fail
      }
      // Else: Still pending, continue polling
      console.log('⏳ Still pending:', latestTx.status);
      return false;
    } catch (err) {
      console.error("Polling error:", err);
      return false;
    }
  };

  // ✅ Retry payment (re-submit form)
  const handleRetry = () => {
    setPaymentStatus('idle');
    setIsSubmitting(false);
    handleSubmit();  // Re-run submit
  };

  // ✅ Submit to backend
  const handleSubmit = async () => {
    if (isSubmitting) return;  // Prevent double-submit
    setIsSubmitting(true);
    setPaymentStatus('idle');

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

      // AccountType
      Object.entries(formData.accountType || {}).forEach(([key, value]) => {
        fd.append(`accountType[${key}]`, value);
      });

      // Photos
      if (Array.isArray(formData.photos)) {
        const photoFiles = formData.photos.filter(photo => photo instanceof File);
        console.log('📸 Photo Files Ready:', photoFiles.length, 'files:', photoFiles.map(p => p.name));  // Debug
        if (photoFiles.length === 0) {
          showToast('No photos selected—add at least one to continue.', true);
          setIsSubmitting(false);
          return;
        }
        photoFiles.forEach((photo) => {
          fd.append("photos", photo);
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

      // Send request (multipart for files)
      const res = await axios.put("http://localhost:5000/api/users/profile", fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("✅ Profile submission response:", res.data);

      if (res.data.requiresPayment) {
        // Payment required: Set up polling
        setPaymentStatus('pending');
        setCheckoutRequestID(res.data.checkoutRequestID);
        showToast("Payment initiated! Check your M-Pesa for PIN prompt.", false);
        
        // Stop polling after 5 mins
        const timeoutIdLocal = setTimeout(() => {
          if (paymentStatus === 'pending') {
            if (intervalId) clearInterval(intervalId);
            setPaymentStatus('failed');
            showToast("Payment timeout. Please try again.", true);
            setIsSubmitting(false);
          }
        }, 300000);  // 5 minutes
        setTimeoutId(timeoutIdLocal);

        // Start polling every 5 seconds
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

        // Set interval ID for cleanup
        setIntervalId(interval);

        return;  // Don't proceed to success yet
      }

      // No payment needed: Direct success
      showToast("Profile submitted successfully!", false);
      setIsSubmitting(false);
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
      showToast(`Submit failed: ${err.response?.data?.error || err.message || 'Unknown error'}`, true);
      setIsSubmitting(false);
      setPaymentStatus('idle');
    }
  };

  // ✅ Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [intervalId, timeoutId]);

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
    <StepReview key="review" formData={formData} />,
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center px-4 py-8">  {/* Pink gradient bg */}
      <div className="bg-white shadow-2xl rounded-2xl p-6 md:p-10 w-full max-w-4xl border border-pink-100">  {/* Pink border */}
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
              className="bg-gradient-to-r from-pink-500 to-rose-500 h-2 rounded-full transition-all duration-300"  
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
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 cursor-pointer"  
              }`}
            >
              {isSubmitting && paymentStatus === 'pending' ? "Processing Payment..." : "Submit"}
            </button>
          )}
        </div>

        {/* ✅ Payment Status Indicator (only show if pending/failed/success) */}
        {paymentStatus === 'pending' && (
          <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl text-center shadow-md">  {/* Pink-themed yellow */}
            <p className="text-yellow-800 font-medium">⏳ Awaiting payment confirmation. Check your phone and enter M-Pesa PIN.</p>
            <p className="text-sm text-yellow-700 mt-1">Request ID: {checkoutRequestID}</p>
          </div>
        )}
        {paymentStatus === 'failed' && (
          <div className="mt-4 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl text-center shadow-md">  {/* Pink-themed red */}
            <p className="text-red-800 font-medium">❌ Payment failed. You can retry below.</p>
            {/* ✅ Retry Button */}
            <button
              onClick={handleRetry}
              className="mt-3 px-6 py-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg hover:from-pink-700 hover:to-rose-700 transition-all font-medium"
            >
              🔄 Retry Payment
            </button>
          </div>
        )}
        {paymentStatus === 'success' && (
          <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl text-center shadow-md">  {/* Pink-themed green for success */}
            <p className="text-green-800 font-medium">✅ Payment successful! Redirecting to profile...</p>
          </div>
        )}
      </div>
    </div>
  );
}