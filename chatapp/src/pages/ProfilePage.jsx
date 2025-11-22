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

import {
  User,
  MapPin,
  Phone,
  Heart,
  DollarSign,
  Camera,
  PlusCircle,
  AlertTriangle,
  Edit2,
  ArrowUpRight,
  Clock,
  Crown,
} from "lucide-react";
import { MdVerified } from "react-icons/md";
import { showToast } from "../components/utils/showToast";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [searchParams] = useSearchParams();
  const [profile, setProfile] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [prorateAmount, setProrateAmount] = useState(0);
  const [newType, setNewType] = useState("");
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

  // Safaricom prefixes (positive list)
  const safaricomPrefixes = useMemo(() => new Set([
    '0700','0701','0702','0703','0704','0705','0706','0707','0708','0709',
    '0710','0711','0712','0713','0714','0715','0716','0717','0718','0719',
    '0720','0721','0722','0723','0724','0725','0726','0727','0728','0729',
    '0740','0741','0742','0743','0745','0746',
    '0757','0758','0759',
    '0768','0769',
    '0790','0791','0792','0793','0794','0795','0796','0797','0798','0799',
    '0110','0111','0112','0113','0114','0115',
  ]), []);

  // Cooldown timer
  useEffect(() => {
    if (!cooldown) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Phone helpers
  const normalizePhone = useCallback((phoneStr) => {
    if (!phoneStr) return null;
    let phone = phoneStr.toString().replace(/\D/g, '');
    if (phone.startsWith('254')) phone = phone.substring(3);
    if (phone.length === 9 && (phone.startsWith('7') || phone.startsWith('1'))) phone = '0' + phone;
    if (phone.length === 10 && (phone.startsWith('07') || phone.startsWith('01'))) return phone;
    return null;
  }, []);

  const getMpesaPhone = useCallback((localPhone) => {
    if (!localPhone || !localPhone.startsWith('0')) return null;
    return '254' + localPhone.substring(1);
  }, []);

  const isSafaricom = useCallback((normalizedPhone) => {
    if (!normalizedPhone || normalizedPhone.length !== 10) return false;
    const prefix = normalizedPhone.substring(0, 4);
    return safaricomPrefixes.has(prefix);
  }, [safaricomPrefixes]);

  // Days left
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

  // Derived state
  const isVerified = profile?.accountType?.type === "VVIP" || profile?.accountType?.type === "Spa";
  const accountType = profile?.accountType?.type || "Regular";
  const isTrial = profile?.isTrial || false;
  const daysLeft = getDaysLeft(profile?.expiryDate);
  const isExpiringSoon = daysLeft > 0 && daysLeft <= 7 && isTrial; // ← 7-day warning for 30-day trial
  const isExpired = profile?.active === false;

  const getBadgeText = () => {
    let text = `${accountType} Account`;
    if (isTrial) text += " (Trial)";
    if (daysLeft !== null && daysLeft > 0) {
      text += ` – ${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`;
      text += ` (Balance: Ksh ${balance})`;
    } else if (balance > 0) {
      text += ` (Balance: Ksh ${balance})`;
    }
    return text;
  };

  const getAvatarUrl = (avatar) => (!avatar ? "/default-avatar.png" : `https://res.cloudinary.com/dcxggvejn/image/upload/${avatar}`);

  // Fetch profile
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

  // Pricing
  const getAmountForType = (type, duration = 30) => {
    const rates = {
      Regular: { 3: 1, 7: 650, 15: 1250, 30: 1800 },
      VIP: { 3: 450, 7: 850, 15: 1650, 30: 2800 },
      VVIP: { 3: 500, 7: 1150, 15: 2300, 30: 3800 },
      Spa: { 3: 800, 7: 1350, 15: 2650, 30: 4800 },
    };
    return rates[type]?.[duration] || 1800;
  };

  // M-Pesa error handler
  const handleMpesaError = (code) => {
    const messages = {
      INSUFFICIENT_BALANCE: "You have insufficient balance.",
      STK_CANCELLED: "You cancelled the STK prompt.",
      STK_TIMEOUT: "The STK push timed out.",
      INVALID_PHONE: "Invalid Safaricom number.",
      NETWORK_ERROR: "Network error.",
    };
    const msg = messages[code] || "Payment failed. Please try again.";
    setErrorMsg(msg);
    showToast(msg, true);
  };

  // Payment initiator
  const initiatePaymentWithPhone = useCallback(async (localPhone, isProrate = false, rest = {}) => {
    if (cooldown > 0) {
      setErrorMsg(`Please wait ${cooldown}s before retrying.`);
      return;
    }
    const normalizedLocal = normalizePhone(localPhone);
    if (!normalizedLocal || !isSafaricom(normalizedLocal)) {
      setErrorMsg("Please enter a valid Safaricom number.");
      return;
    }
    const mpesaPhone = getMpesaPhone(normalizedLocal);
    setPaymentLoading(true);
    setErrorMsg("");

    try {
      const res = isProrate
        ? await api.post("/payments/prorate-upgrade", { userId: user._id, phone: mpesaPhone, ...rest })
        : await api.post("/users/payments/initiate", { phone: mpesaPhone, ...rest });

      if (res.data.success) {
        showToast("STK Push sent. Check your phone.", false);
        intervalRef.current = setInterval(fetchProfile, 3000);
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
      const code = err.response?.data?.code || "NETWORK_ERROR";
      handleMpesaError(code);
    }
    setPaymentLoading(false);
    setCooldown(30);
  }, [user._id, fetchProfile, normalizePhone, getMpesaPhone, isSafaricom, cooldown]);

  // Payment handlers
  const handleProratePayment = useCallback(async () => {
    if (paymentLoading || cooldown > 0 || prorateAmount === 0 || !newType || !profile) return;
    const phone = profile.personal?.phone;
    if (!phone || !normalizePhone(phone) || !isSafaricom(normalizePhone(phone))) {
      setErrorMsg("Invalid or non-Safaricom phone in profile.");
      return;
    }
    await initiatePaymentWithPhone(phone, true, { amount: prorateAmount, newType });
  }, [paymentLoading, cooldown, prorateAmount, newType, profile, initiatePaymentWithPhone]);

  const handlePayNow = useCallback(async () => {
    if (paymentLoading || cooldown > 0 || !profile) return;
    const phone = profile.personal?.phone;
    if (!phone || !normalizePhone(phone) || !isSafaricom(normalizePhone(phone))) {
      setErrorMsg("Invalid or non-Safaricom phone in profile.");
      return;
    }
    const duration = profile?.accountType?.duration || 30;
    const amount = getAmountForType(profile?.accountType?.type, duration);
    await initiatePaymentWithPhone(phone, false, {
      accountType: profile?.accountType?.type,
      duration,
      amount,
      profileData: profile,
    });
  }, [paymentLoading, cooldown, profile, initiatePaymentWithPhone, getAmountForType]);

  const showCustomPhonePrompt = useCallback((message, config, isProrate = false) => {
    setPromptMessage(message);
    setOnPhoneSubmit(() => (phone) => initiatePaymentWithPhone(phone, isProrate, config));
    setShowPhonePrompt(true);
    setEnteredPhone(profile?.personal?.phone || "");
  }, [profile?.personal?.phone, initiatePaymentWithPhone]);

  // Prorate from email
  useEffect(() => {
    const userId = searchParams.get('userId');
    const amount = searchParams.get('amount');
    const newTypeParam = searchParams.get('newType');
    if (userId && amount && newTypeParam && userId === user?._id) {
      setProrateAmount(parseInt(amount));
      setNewType(newTypeParam);
    }
  }, [searchParams, user?._id]);

  useEffect(() => {
    if (prorateAmount > 0 && newType && profile && !paymentLoading && cooldown === 0) {
      handleProratePayment();
    }
  }, [prorateAmount, newType, profile, paymentLoading, cooldown, handleProratePayment]);

  // Initial fetch
  useEffect(() => {
    const init = async () => {
      setFetchLoading(true);
      await fetchProfile();
      setFetchLoading(false);
    };
    init();
  }, [fetchProfile]);

  // Cleanup
  useEffect(() => () => intervalRef.current && clearInterval(intervalRef.current), []);

  useEffect(() => {
    if (profile && !isExpired && paymentLoading) {
      setPaymentLoading(false);
      intervalRef.current && clearInterval(intervalRef.current);
      fetchProfile();
    }
  }, [profile, isExpired, paymentLoading, fetchProfile]);

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
    const normalized = normalizePhone(enteredPhone);
    if (!normalized || !isSafaricom(normalized)) {
      setErrorMsg("Please enter a valid Safaricom number.");
      return;
    }
    await onPhoneSubmit(normalized);
    setShowPhonePrompt(false);
    setEnteredPhone("");
    setOnPhoneSubmit(null);
  };

  const handlePhoneCancel = () => {
    setShowPhonePrompt(false);
    setEnteredPhone("");
    setPromptMessage("");
    setOnPhoneSubmit(null);
    setErrorMsg("");
  };

  const normalizedEnteredPhone = normalizePhone(enteredPhone);
  const isValidCustomPhone = !!normalizedEnteredPhone && isSafaricom(normalizedEnteredPhone);

  return (
    <ProfileLayout>
      {fetchLoading && (
        <div className="flex flex-col items-center justify-center h-64 gap-2">
          <l-dot-stream size="60" speed="2.5" color="#ec4899"></l-dot-stream>
          <p className="text-pink-500 font-medium">Loading your profile...</p>
        </div>
      )}

      {error && !showPhonePrompt && <div className="p-6 text-center text-red-500">{error}</div>}

      {/* No profile yet */}
      {!fetchLoading && !error && !profile && user && (
        <>
          <div className="bg-gradient-to-r from-pink-200 to-pink-500 h-48 relative">
            <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
              <img src={getAvatarUrl(user.avatar)} alt={`${user.username}'s avatar`} className="w-36 h-36 rounded-full border-4 border-pink-500 shadow-lg object-cover" />
              <h1 className="mt-6 text-2xl md:text-3xl font-bold text-gray-800">{user.username}</h1>
              <p className="mt-1 text-gray-600">{user.email}</p>
            </div>
          </div>

          <div className="max-w-5xl mx-auto mt-28 space-y-6 p-4 text-center">
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <p className="text-gray-600 mb-4 flex items-center justify-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                You are not listed yet. Activate your free 30-day trial to unlock full features!
              </p>
              <Link
                to="/create-account"
                className="inline-flex items-center gap-2 px-6 py-3 bg-pink-600 text-white rounded-lg shadow hover:bg-pink-700 font-medium transition-colors"
              >
                <PlusCircle size={20} />
                Activate Your Free 30-Day Trial
              </Link>
            </div>
          </div>
        </>
      )}

      {/* Profile exists */}
      {profile && (
        <>
          {/* Expired banner */}
          {isExpired && (
            <div className="max-w-5xl mx-auto mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-center">
              <p className="text-red-800 flex items-center justify-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5" />
                Your {accountType} {isTrial ? "trial" : "subscription"} has expired. Reactivate now to regain visibility!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <button
                  onClick={handlePayNow}
                  disabled={paymentLoading || cooldown > 0}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 disabled:bg-red-400 transition-colors"
                >
                  {paymentLoading ? <l-dot-stream size="20" speed="1.5" color="white"></l-dot-stream> : <DollarSign size={20} />}
                  {paymentLoading ? "Processing..." : cooldown > 0 ? `Retry in ${cooldown}s` : "Reactivate Now"}
                </button>

                <button
                  onClick={() => {
                    const duration = profile?.accountType?.duration || 30;
                    const amount = getAmountForType(profile?.accountType?.type, duration);
                    showCustomPhonePrompt("Enter your Safaricom number to receive the STK Push.", {
                      accountType: profile?.accountType?.type,
                      duration,
                      amount,
                      profileData: profile,
                    }, false);
                  }}
                  disabled={paymentLoading || cooldown > 0}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 disabled:bg-red-400 transition-colors"
                >
                  <Phone size={20} />
                  Use Another Number
                </button>
              </div>
              {errorMsg && <p className="text-red-500 text-sm mt-3">{errorMsg}</p>}
            </div>
          )}

          {/* Trial expiring soon banner */}
          {!isExpired && isExpiringSoon && (
            <div className="max-w-5xl mx-auto mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-center">
              <p className="text-yellow-800 flex items-center justify-center gap-2">
                <Clock className="w-5 h-5" />
                Your 30-day free trial ends in {daysLeft} day{daysLeft !== 1 ? "s" : ""}! Upgrade now to stay listed.
              </p>
              <div className="flex gap-4 mt-4 justify-center">
                <Link
                  to="/upgrade-account"
                  className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-medium transition-colors"
                >
                  <Crown className="inline mr-2" size={18} />
                  Upgrade Now
                </Link>
              </div>
            </div>
          )}

          {/* Banner */}
          <div className="bg-gradient-to-r from-pink-200 to-pink-500 h-48 relative">
            <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
              <div className="relative">
                {profile.photos && profile.photos.length > 0 ? (
                  <>
                    <AdvancedImage
                      cldImg={cld.image(profile.photos[0]).resize(auto().gravity(autoGravity()))}
                      className="w-36 h-36 rounded-full border-4 border-pink-500 shadow-lg object-cover hover:scale-105 transition-transform duration-200"
                      alt={`${profile.personal?.username}'s profile photo`}
                    />
                    {isVerified && <MdVerified className="absolute top-3 left-3 text-pink-500 text-xl" />}
                  </>
                ) : (
                  <div className="w-36 h-36 rounded-full border-4 border-pink-500 shadow-lg bg-gray-200 flex items-center justify-center text-gray-500">
                    No Photo
                  </div>
                )}
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
                <MapPin size={16} /> {profile.location?.county}, {profile.location?.constituency}
              </p>
            </div>
          </div>

          {/* Main content */}
          <div className="max-w-5xl mx-auto mt-28 space-y-6 p-4">
            {/* Edit button */}
            <div className="text-right">
              <Link
                to="/edit-profile"
                className={`inline-flex items-center gap-1 px-3 py-1 text-sm rounded-md transition-colors ${
                  isExpired
                    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                    : "bg-pink-100 text-pink-700 hover:bg-pink-200"
                }`}
                onClick={(e) => isExpired && e.preventDefault()}
              >
                <Edit2 size={14} />
                {isExpired ? "Reactivate to Edit" : "Edit Profile"}
              </Link>
            </div>

            {/* Account Type */}
            <DelistedOverlay>
              <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <h2 className="text-xl md:text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Crown className="text-pink-500" size={25} /> Account Type
                </h2>
                <div className="flex items-center justify-center gap-4">
                  <span className={`px-4 py-2 rounded-full border font-semibold flex items-center gap-2 ${getAccountBadgeClass(accountType)}`}>
                    {isVerified && <MdVerified className="w-4 h-4 text-pink-500" />}
                    {getBadgeText()}
                  </span>
                </div>

                {/* 30-day trial box */}
                {isTrial && (
                  <div className="mt-6 p-5 bg-pink-50 border-l-4 border-pink-400 rounded-r-lg text-center">
                    <p className="text-pink-800 font-medium">
                      <Clock className="inline mr-2" size={18} />
                      You're on a <strong>30-day free trial</strong>!
                      <br />
                      {daysLeft > 0
                        ? `${daysLeft} day${daysLeft !== 1 ? "s" : ""} remaining`
                        : "This is your last day!"}
                    </p>
                    <Link
                      to="/upgrade-account"
                      className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 font-medium"
                    >
                      <Crown size={18} />
                      Upgrade Now
                    </Link>
                  </div>
                )}

                {/* Not verified */}
                {!isVerified && !isTrial && (
                  <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                    <p className="text-yellow-800 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Upgrade to VVIP or Spa for verified badge and priority listing!
                    </p>
                    <Link
                      to="/upgrade-account"
                      className="inline-flex items-center gap-1 mt-2 px-3 py-1 text-sm bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                    >
                      <ArrowUpRight size={14} /> Upgrade Now
                    </Link>
                  </div>
                )}
              </div>
            </DelistedOverlay>

            {/* Personal Info */}
            <DelistedOverlay>
              <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <h2 className="text-xl md:text-2xl font-semibold mb-4 flex items-center gap-2">
                  <User className="text-pink-500" size={25} /> Personal Info
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                  <p>
                    <span className="font-medium flex items-center gap-1">
                      <Phone size={16} /> Phone:
                    </span>{" "}
                    {profile.personal?.phone || "Not set"}
                  </p>
                  <p>
                    <span className="font-medium">Ethnicity:</span> {profile.personal?.ethnicity || "Not set"}
                  </p>
                  <p>
                    <span className="font-medium">Orientation:</span> {profile.personal?.orientation || "Not set"}
                  </p>
                </div>
              </div>
            </DelistedOverlay>

            {/* Rates */}
            <DelistedOverlay>
              <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <h2 className="text-xl md:text-2xl font-semibold mb-4 flex items-center gap-2">
                  <DollarSign className="text-pink-500" size={25} /> Rates
                </h2>
                <div className="flex flex-wrap gap-3">
                  <span className="bg-pink-100 text-pink-500 px-4 py-2 rounded-lg font-medium">
                    Incall: Ksh {profile.additional?.incallRate || 0}
                  </span>
                  <span className="bg-pink-100 text-pink-500 px-4 py-2 rounded-lg font-medium">
                    Outcall: Ksh {profile.additional?.outcallRate || 0}
                  </span>
                </div>
              </div>
            </DelistedOverlay>

            {/* Services */}
            {profile.services?.selected?.length > 0 && (
              <DelistedOverlay>
                <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                  <h2 className="text-xl md:text-2xl font-semibold mb-4 flex items-center gap-2">
                    <Heart size={25} className="text-pink-500" /> Services
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {profile.services.selected.map((service, i) => (
                      <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors">
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
                  <User size={25} className="text-pink-500" /> About Me
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
                    <Camera size={25} className="text-pink-500" /> Photos
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {profile.photos.map((publicId, i) => (
                      <div key={i} className="relative overflow-hidden rounded-lg shadow aspect-square bg-gray-100">
                        <AdvancedImage
                          cldImg={cld.image(publicId).resize(auto().gravity(autoGravity()))}
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

      {/* Phone prompt modal */}
      {showPhonePrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
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
            {errorMsg && <p className="text-red-500 text-sm mb-3">{errorMsg}</p>}
            <div className="flex gap-3 justify-end">
              <button
                onClick={handlePhoneCancel}
                disabled={paymentLoading}
                className="px-5 py-2 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePhoneSubmit}
                disabled={!isValidCustomPhone || paymentLoading || cooldown > 0}
                className="px-5 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:bg-gray-300 transition-colors flex items-center gap-2"
              >
                {paymentLoading ? <l-dot-stream size="16" speed="1.5" color="white"></l-dot-stream> : null}
                {paymentLoading ? "Processing..." : cooldown > 0 ? `Retry in ${cooldown}s` : "Send STK Push"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ProfileLayout>
  );
}