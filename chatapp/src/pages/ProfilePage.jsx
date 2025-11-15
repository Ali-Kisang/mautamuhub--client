import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import api from "../utils/axiosInstance";
import { useAuthStore } from "../store/useAuthStore";
import ProfileLayout from "./ProfileLayout";
import { DotStream } from "ldrs/react";


import { User, MapPin, Phone, Heart, DollarSign, Camera, PlusCircle, AlertTriangle, Edit2, ArrowUpRight, Clock, Crown } from "lucide-react";
import { MdVerified } from "react-icons/md";
import { showToast } from "../components/utils/showToast";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [searchParams] = useSearchParams();
  const [profile, setProfile] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true); // Renamed to distinguish from payment loading
  const [error, setError] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false); // Renamed for clarity
  const [balance, setBalance] = useState(0);
  const [prorateAmount, setProrateAmount] = useState(0);
  const [newType, setNewType] = useState(""); // ✅ NEW: Track newType for prorate
  const [showPhonePrompt, setShowPhonePrompt] = useState(false);
  const [enteredPhone, setEnteredPhone] = useState("");
  const [promptMessage, setPromptMessage] = useState("");
  const [onPhoneSubmit, setOnPhoneSubmit] = useState(null);
  const [cooldown, setCooldown] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const intervalRef = useRef(null);

  const cld = new Cloudinary({
    cloud: { cloudName: "dcxggvejn" },
  });

  // ✅ UPDATED: Safaricom prefixes (positive list for accuracy)
  const safaricomPrefixes = useMemo(() => new Set([
    // 07xx
    '0700','0701','0702','0703','0704','0705','0706','0707','0708','0709',
    '0710','0711','0712','0713','0714','0715','0716','0717','0718','0719',
    '0720','0721','0722','0723','0724','0725','0726','0727','0728','0729',
    '0740','0741','0742','0743','0745','0746',
    '0757','0758','0759',
    '0768','0769',
    '0790','0791','0792','0793','0794','0795','0796','0797','0798','0799',
    // 01xx
    '0110','0111','0112','0113','0114','0115',
    // Add more as needed (e.g., '0748' if confirmed Safaricom)
  ]), []);

  // ✅ 2. Cooldown Countdown
  useEffect(() => {
    if (!cooldown) return;

    const timer = setInterval(() => {
      setCooldown((c) => c - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  // ✅ UPDATED: Normalize phone number to standard 0xxxxxxxxx format (local, handles 07xx and 01xx)
  const normalizePhone = useCallback((phoneStr) => {
    if (!phoneStr) return null;
    let phone = phoneStr.toString().replace(/\D/g, ''); // Remove non-digits
    if (phone.startsWith('254')) {
      phone = phone.substring(3);
    }
    if (phone.length === 9 && (phone.startsWith('7') || phone.startsWith('1'))) {
      phone = '0' + phone; // To 07xx or 01xx
    }
    if (phone.length === 10 && (phone.startsWith('07') || phone.startsWith('01'))) {
      return phone;
    }
    return null;
  }, []);

  // ✅ NEW: Get M-Pesa international format (254xxxxxxxxx)
  const getMpesaPhone = useCallback((localPhone) => {
    if (!localPhone || !localPhone.startsWith('0')) return null;
    return '254' + localPhone.substring(1);
  }, []);

  // ✅ UPDATED: Validate Safaricom number (positive list check)
  const isSafaricom = useCallback((normalizedPhone) => {
    if (!normalizedPhone || normalizedPhone.length !== 10) return false;
    const prefix = normalizedPhone.substring(0, 4);
    return safaricomPrefixes.has(prefix);
  }, [safaricomPrefixes]);

  // Helper functions (early, for derived state)
  const getDaysLeft = (expiryDate) => {
    if (!expiryDate) return null;
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const getAccountBadgeClass = (type) => {
    switch (type) {
      case "Spa": return "bg-purple-100 text-purple-800 border-purple-300";
      case "VVIP": return "bg-indigo-100 text-indigo-800 border-indigo-300";
      case "VIP": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Regular": return "bg-gray-100 text-gray-800 border-gray-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  // ✅ MOVED UP: Derived state early, before useEffects that depend on them
  const isVerified = profile?.accountType?.type === "VVIP" || profile?.accountType?.type === "Spa";
  const accountType = profile?.accountType?.type || "Regular";
  const isTrial = profile?.isTrial || false;
  const daysLeft = getDaysLeft(profile?.expiryDate);
  const isExpiringSoon = daysLeft > 0 && daysLeft <= 3 && isTrial;
  const isExpired = profile?.active === false;

  // ✅ UPDATED: Badge text with balance next to days (always show if balance > 0)
  const getBadgeText = () => {
    let text = `${accountType} Account`;
    if (isTrial) text += " (Trial)";
    if (daysLeft !== null && daysLeft > 0) {
      text += ` – ${daysLeft} days left`;
      text += ` (Balance: Ksh ${balance})`;
    } else if (balance > 0) {
      text += ` (Balance: Ksh ${balance})`; // Show standalone if no days
    }
    return text;
  };

  const getAvatarUrl = (avatar) => {
    if (!avatar) return "/default-avatar.png";
    return `https://res.cloudinary.com/dcxggvejn/image/upload/${avatar}`;
  };

  // ✅ MOVED UP: fetchProfile before anything that depends on it
  const fetchProfile = useCallback(async () => {
    if (!user?._id) {
      setError("You are not logged in.");
      return;
    }

    try {
      const res = await api.get("/users/check-profile");
      if (res.data.hasProfile) {
        setProfile(res.data.profile);
        setBalance(res.data.balance || res.data.profile.user?.balance || 0);
      } else {
        setProfile(null);
        setBalance(res.data.balance || 0);
      }
    } catch (err) {
      console.error("Check profile error:", err);
      setError("Could not check profile status");
    }
  }, [user?._id]);

  // ✅ UPDATED: Get amount for extension (match tier pricing) - moved up
  const getAmountForType = (type, duration = 30) => {
    const rates = {
      Regular: { 3: 1, 7: 650, 15: 1250, 30: 1800 },
      VIP: { 3: 450, 7: 850, 15: 1650, 30: 2800 },
      VVIP: { 3: 500, 7: 1150, 15: 2300, 30: 3800 },
      Spa: { 3: 800, 7: 1350, 15: 2650, 30: 4800 },
    };
    return rates[type]?.[duration] || 1800;
  };

  // ✅ 4. Centralized M-Pesa Error Handler
  const handleMpesaError = (code) => {
    let msg = "Payment failed. Please try again.";

    switch (code) {
      case "INSUFFICIENT_BALANCE":
        msg = "You have insufficient balance to complete this transaction.";
        break;
      case "STK_CANCELLED":
        msg = "You cancelled the STK prompt. Try again.";
        break;
      case "STK_TIMEOUT":
        msg = "The STK push timed out. Ensure your phone is unlocked.";
        break;
      case "INVALID_PHONE":
        msg = "Invalid Safaricom number. Please check and try again.";
        break;
      case "NETWORK_ERROR":
        msg = "Network error. Please check your connection.";
        break;
      default:
        msg = "An unknown error occurred.";
    }

    setErrorMsg(msg);
    showToast(msg, true);
  };

  // ✅ 3. Wrap initiatePaymentWithPhone With UI Logic (merged with existing polling logic)
  const initiatePaymentWithPhone = useCallback(async (localPhone, isProrate = false, rest = {}) => {
    if (cooldown > 0) {
      setErrorMsg(`Please wait ${cooldown}s before retrying.`);
      return;
    }

    const normalizedLocal = normalizePhone(localPhone);
    if (!normalizedLocal) {
      setErrorMsg("Invalid phone number. Please use a valid Kenyan number.");
      return;
    }

    const mpesaPhone = getMpesaPhone(normalizedLocal);
    if (!mpesaPhone) {
      setErrorMsg("Failed to format phone for M-Pesa.");
      return;
    }

    console.log('Sending M-Pesa phone:', mpesaPhone); // ✅ DEBUG: Log for troubleshooting

    setPaymentLoading(true);
    setErrorMsg("");

    try {
      let res;
      if (isProrate) {
        res = await api.post("/payments/prorate-upgrade", {
          userId: user._id,
          phone: mpesaPhone, // ✅ Send international format
          ...rest,
        });
      } else {
        res = await api.post("/users/payments/initiate", { phone: mpesaPhone, ...rest }); // ✅ Send international format
      }
      console.log('Payment initiation response:', res.data); // ✅ DEBUG: Log response

      if (res.data.success) {
        showToast("STK Push sent. Check your phone.", false);
        // Keep existing polling for balance update
        intervalRef.current = setInterval(async () => {
          await fetchProfile();
        }, 3000);

        setTimeout(() => {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            setPaymentLoading(false);
          }
        }, 300000);
      } else {
        handleMpesaError(res.data.errorCode);
      }
    } catch (err) {
      console.error("Payment initiation error:", err); // ✅ DEBUG: Full error log
      const errorCode = err.response?.data?.code || "NETWORK_ERROR";
      handleMpesaError(errorCode);
    }

    setPaymentLoading(false);
    setCooldown(30); // ⏳ Start 30s retry timer
  }, [user._id, fetchProfile, normalizePhone, getMpesaPhone, cooldown]);

  // ✅ UPDATED: handleProratePayment - direct with profile phone
  const handleProratePayment = useCallback(async () => {
    if (paymentLoading || cooldown > 0 || prorateAmount === 0 || !newType || !profile) return;

    const phone = profile.personal?.phone;
    if (!phone) {
      setErrorMsg("No phone number associated with your profile.");
      return;
    }

    const normalizedPhone = normalizePhone(phone);
    if (!normalizedPhone) {
      setErrorMsg("Invalid phone number in profile. Please update your profile.");
      return;
    }

    if (!isSafaricom(normalizedPhone)) {
      setErrorMsg("Profile phone is not a Safaricom number. Please use the 'Enter Safaricom Number' option.");
      return;
    }

    const rest = { amount: prorateAmount, newType };
    await initiatePaymentWithPhone(normalizedPhone, true, rest); // ✅ FIXED: Pass normalized for consistency
  }, [paymentLoading, cooldown, prorateAmount, newType, profile, normalizePhone, isSafaricom, initiatePaymentWithPhone]);

  // ✅ UPDATED: handlePayNow - direct with profile phone
  const handlePayNow = useCallback(async () => {
    if (paymentLoading || cooldown > 0 || !user?._id || !profile) return;

    const phone = profile.personal?.phone;
    if (!phone) {
      setErrorMsg("No phone number associated with your profile.");
      return;
    }

    const normalizedPhone = normalizePhone(phone);
    if (!normalizedPhone) {
      setErrorMsg("Invalid phone number in profile. Please update your profile.");
      return;
    }

    if (!isSafaricom(normalizedPhone)) {
      setErrorMsg("Profile phone is not a Safaricom number. Please use the 'Enter Safaricom Number' option.");
      return;
    }

    const duration = profile?.accountType?.duration || 30;
    const amount = getAmountForType(profile?.accountType?.type, duration);
    const rest = { accountType: profile?.accountType?.type, duration, amount, profileData: profile };
    await initiatePaymentWithPhone(normalizedPhone, false, rest); // ✅ FIXED: Pass normalized for consistency
  }, [paymentLoading, cooldown, user?._id, profile, normalizePhone, isSafaricom, getAmountForType, initiatePaymentWithPhone]);

  const showCustomPhonePrompt = useCallback((message, config, isProrate = false) => {
    setPromptMessage(message);
    setOnPhoneSubmit(() => (phone) =>
      initiatePaymentWithPhone(phone, isProrate, config)
    );
    setShowPhonePrompt(true);
    setEnteredPhone(profile?.personal?.phone || "");
    setError(null);
    setErrorMsg(""); // Clear on show
  }, [profile?.personal?.phone, initiatePaymentWithPhone]);

  // ✅ UPDATED: Handle prorate link from email (query params) - set states only
  useEffect(() => {
    const userId = searchParams.get('userId');
    const amount = searchParams.get('amount');
    const newTypeParam = searchParams.get('newType');
    if (userId && amount && newTypeParam && userId === user?._id) {
      setProrateAmount(parseInt(amount));
      setNewType(newTypeParam); // ✅ Set newType
      // Defer call to handleProratePayment until profile is ready
    }
  }, [searchParams, user?._id]);

  // ✅ NEW: Trigger prorate payment once profile is loaded (now after handleProratePayment definition)
  useEffect(() => {
    if (prorateAmount > 0 && newType && profile && !paymentLoading && cooldown === 0) {
      handleProratePayment();
    }
  }, [prorateAmount, newType, profile, paymentLoading, cooldown, handleProratePayment]);

  useEffect(() => {
    const initFetch = async () => {
      setFetchLoading(true);
      await fetchProfile();
      setFetchLoading(false);
    };

    initFetch();
  }, [fetchProfile]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (profile && !isExpired && paymentLoading) {
      setPaymentLoading(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      fetchProfile(); // Refetch to update balance/profile after payment
    }
  }, [profile, isExpired, paymentLoading, fetchProfile]);

  // ✅ NEW: Render delisted overlay for expired sections
  const DelistedOverlay = ({ children }) => (
    <div className="relative">
      {children}
      {isExpired && (
        <div className="absolute inset-0 bg-gray-50/50 rounded-xl flex items-center justify-center pointer-events-none z-10">
          <p className="text-gray-500 text-sm flex items-center gap-1">
            <AlertTriangle size={14} className="text-red-400" />
            Profile delisted – Reactivate to view publicly
          </p>
        </div>
      )}
    </div>
  );

  const handlePhoneSubmit = async () => {
    const normalizedEntered = normalizePhone(enteredPhone);

    if (!normalizedEntered) {
      setErrorMsg("Invalid number format.");
      return;
    }

    if (!isSafaricom(normalizedEntered)) {
      setErrorMsg("Enter a valid Safaricom number.");
      return;
    }

    await onPhoneSubmit(normalizedEntered);

    setShowPhonePrompt(false);
    setEnteredPhone("");
    setOnPhoneSubmit(null);
  };

  // ✅ NEW: Handle phone prompt cancel
  const handlePhoneCancel = () => {
    setShowPhonePrompt(false);
    setEnteredPhone("");
    setPromptMessage("");
    setOnPhoneSubmit(null);
    setError(null);
    setErrorMsg("");
  };

  // ✅ Compute for button disabled state
  const normalizedEnteredPhone = normalizePhone(enteredPhone);
  const isValidCustomPhone = !!normalizedEnteredPhone && isSafaricom(normalizedEnteredPhone);

  return (
    <ProfileLayout>
      {fetchLoading && (
        <div className="flex flex-col items-center justify-center h-64 gap-2" role="status" aria-live="polite">
          <l-dot-stream size="60" speed="2.5" color="#ec4899"></l-dot-stream>
          <p className="text-pink-500 font-medium">Loading your profile...</p>
        </div>
      )}

      {error && !showPhonePrompt && (
        <div className="p-6 text-center text-red-500" role="alert">
          {error}
        </div>
      )}

      {/* 🔹 If no profile, show user fallback */}
      {!fetchLoading && !error && !profile && user && (
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
                Activate Your Free Trial Account
              </Link>
            </div>
          </div>
        </>
      )}

      {/* 🔹 If profile exists (active or expired), show full page with conditional banners */}
      {profile && (
        <>
          {/* Conditional Expiry Banner (shows for active: false) */}
          {isExpired && (
            <div className="max-w-5xl mx-auto mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-center">
              <p className="text-red-800 flex items-center justify-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5" aria-hidden="true" />
                Your {accountType} {isTrial ? 'trial' : 'subscription'} has expired. Pay now to reactivate and extend {profile?.accountType?.duration || 30} days! (Balance: Ksh {balance})
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
                <button
                  onClick={handlePayNow} 
                  disabled={paymentLoading || cooldown > 0}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 disabled:bg-red-300 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
                  aria-label="Reactivate with profile number"
                >
                  {paymentLoading ? (
                    <l-dot-stream size="20" speed="1.5" color="white"></l-dot-stream>
                  ) : (
                    <DollarSign size={18} />
                  )}
                  {paymentLoading ? "Processing..." : cooldown > 0 ? `Retry in ${cooldown}s` : "Reactivate"}
                </button>
                <p className="text-sm text-gray-600 whitespace-nowrap sm:mx-2">Not your M-Pesa Number?</p>
                <button
                  onClick={() => {
                    const duration = profile?.accountType?.duration || 30;
                    const amount = getAmountForType(profile?.accountType?.type, duration);
                    const config = {
                      accountType: profile?.accountType?.type,
                      duration,
                      amount,
                      profileData: profile,
                    };
                    showCustomPhonePrompt("Enter your Safaricom number to receive the STK Push.", config, false);
                  }}
                  disabled={paymentLoading || cooldown > 0}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-400 text-white rounded-lg shadow hover:bg-red-500 disabled:bg-red-300 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
                  aria-label="Enter Safaricom number"
                >
                  <Phone size={18} />
                  {paymentLoading ? "Processing..." : cooldown > 0 ? `Retry in ${cooldown}s` : "Enter Number"}
                </button>
              </div>
              {/* ✅ 5. Use Loading & Cooldown in UI - Error display */}
              {errorMsg && (
                <p className="text-red-500 text-sm mt-2">{errorMsg}</p>
              )}
            </div>
          )}

          {/* Conditional Expiring Soon Banner (for active trials only) */}
          {!isExpired && isExpiringSoon && (
            <div className="max-w-5xl mx-auto mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <p className="text-yellow-800 flex items-center justify-center gap-2">
                <Clock className="w-5 h-5" aria-hidden="true" />
                Your trial ends in {daysLeft} day{daysLeft !== 1 ? 's' : ''} (Balance: Ksh {balance}). Extend or upgrade to keep your {accountType} features!
              </p>
              <div className="flex flex-col sm:flex-row gap-2 mt-2 justify-center">
                <button
                  onClick={handlePayNow} // Extension
                  disabled={paymentLoading || cooldown > 0}
                  className="px-3 py-1 text-sm bg-yellow-500 text-white rounded-md hover:bg-yellow-600 disabled:bg-yellow-300"
                >
                  {paymentLoading ? "Processing..." : cooldown > 0 ? `Retry in ${cooldown}s` : "Extend Trial"}
                </button>
                <Link
                  to="/upgrade-account"
                  className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                  aria-label="Upgrade before expiry"
                >
                  <ArrowUpRight size={14} />
                  Upgrade Now
                </Link>
              </div>
              {/* ✅ 5. Use Loading & Cooldown in UI - Error display */}
              {errorMsg && (
                <p className="text-red-500 text-sm mt-2">{errorMsg}</p>
              )}
            </div>
          )}

          {/* Full Profile Content (always render if profile exists) */}
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
                {/* ✅ NEW: Delisted badge on banner if expired */}
                {isExpired && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <AlertTriangle size={10} />
                    Delisted
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
            {/* Edit CTA – disable if expired */}
            <div className="text-right">
              <Link
                to="/edit-profile"
                className={`inline-flex items-center gap-1 px-3 py-1 text-sm rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-pink-300 ${
                  isExpired 
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                    : 'bg-pink-100 text-pink-700 hover:bg-pink-200'
                }`}
                aria-label="Edit your profile"
                onClick={(e) => isExpired && e.preventDefault()}  // Prevent if expired
              >
                <Edit2 size={14} />
                {isExpired ? 'Reactivate to Edit' : 'Edit Profile'}
              </Link>
            </div>

            {/* Account Type Badge */}
            <DelistedOverlay>
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
                      You're not verified. Upgrade to VVIP or Spa for better visibility and priority features!
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
                  <div className="mt-4 p-4 bg-pink-50 border-l-4 border-pink-400 rounded-r-lg">
                    <p className="text-pink-800 flex items-center gap-2">
                      <Clock className="w-5 h-5" aria-hidden="true" />
                      Enjoying your free trial? Upgrade anytime to continue without interruptions.
                    </p>
                    <Link
                      to="/upgrade-account"
                      className="inline-flex items-center gap-1 mt-2 px-3 py-1 text-sm bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-300"
                      aria-label="Upgrade from trial"
                    >
                      <ArrowUpRight size={14} />
                      Upgrade to Full
                    </Link>
                  </div>
                )}
              </div>
            </DelistedOverlay>

            {/* Personal Info */}
            <DelistedOverlay>
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
            </DelistedOverlay>

            {/* Rates */}
            <DelistedOverlay>
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
            </DelistedOverlay>

            {/* Services */}
            {profile.services?.selected?.length > 0 && (
              <DelistedOverlay>
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
              </DelistedOverlay>
            )}

            {/* About Me */}
            <DelistedOverlay>
              <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <h2 className="text-xl md:text-2xl font-semibold mb-4 flex items-center gap-2">
                  <User size={25} className="text-pink-500" aria-hidden="true" /> About Me
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {profile.additional?.description || "No description available."}
                </p>
              </div>
            </DelistedOverlay>

            {/* Photos */}
            {profile.photos && profile.photos.length > 0 ? (
              <DelistedOverlay>
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
              </DelistedOverlay>
            ) : (
              <DelistedOverlay>
                <div className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-500">
                  No photos uploaded yet.
                </div>
              </DelistedOverlay>
            )}
          </div>
        </>
      )}

      {/* ✅ NEW: Safaricom Phone Prompt Modal */}
      {showPhonePrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Enter Safaricom Number</h3>
              <p className="text-gray-600 mb-4">{promptMessage}</p>
              <input
                type="tel"
                placeholder="07xxxxxxxx or 01xxxxxxxx"
                value={enteredPhone}
                onChange={(e) => setEnteredPhone(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 mb-4"
                disabled={paymentLoading || cooldown > 0}
              />
              {/* ✅ 5. Inside phone prompt */}
              {errorMsg && (
                <p className="text-red-500 text-sm mt-2">{errorMsg}</p>
              )}
              <div className="flex gap-2 justify-end">
                <button
                  onClick={handlePhoneCancel}
                  disabled={paymentLoading}
                  className="px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePhoneSubmit}
                  disabled={!isValidCustomPhone || paymentLoading || cooldown > 0}
                  className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:bg-gray-300 transition-colors flex items-center gap-2"
                >
                  {paymentLoading ? (
                    <l-dot-stream size="16" speed="1.5" color="white"></l-dot-stream>
                  ) : null}
                  {paymentLoading ? "Processing..." : cooldown > 0 ? `Retry in ${cooldown}s` : "Send STK Push"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ProfileLayout>
  );
}