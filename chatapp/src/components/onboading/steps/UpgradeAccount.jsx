import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Lucide icons
import { Crown, ArrowUpRight, CreditCard, Clock, CheckCircle } from "lucide-react";
import { useAuthStore } from "../../../store/useAuthStore";
import api from "../../../utils/axiosInstance";
import { showToast } from "../../utils/showToast";
import { DotStream } from "ldrs/react";
import { MdVerified } from "react-icons/md";
import { DollarSign } from "lucide-react"; // ✅ NEW: For balance icon

export default function UpgradeAccount() {
  const { user } = useAuthStore();
  const [currentProfile, setCurrentProfile] = useState(null);
  const [balance, setBalance] = useState(0); // ✅ NEW: Balance state
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState('idle');  
  const [checkoutRequestID, setCheckoutRequestID] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);
  const [pollStartTime, setPollStartTime] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedDurations, setSelectedDurations] = useState({});  
  const navigate = useNavigate();

  const accountTiers = [
    {
      type: "Regular",
      pricing: { 3: 1, 7: 650, 15: 1250, 30: 1800 },
      durationOptions: [3, 7, 15, 30],
      benefits: ["Basic visibility", "Post up to 4 photos", "Standard matching", "Basic customer support"],
      verified: false,
      badgeClass: "bg-gray-100 text-gray-800",
    },
    {
      type: "VIP",
      pricing: { 3: 450, 7: 850, 15: 1650, 30: 2800 },  
      durationOptions: [3, 7, 15, 30],
      benefits: ["Priority in county searches", "Post up to 6 photos", "Real-time chat", "Featured placement", "Standard support"],
      verified: false,
      badgeClass: "bg-yellow-100 text-yellow-800",
    },
    {
      type: "VVIP",
      pricing: { 3: 500, 7: 1150, 15: 2300, 30: 3800 },
      durationOptions: [3, 7, 15, 30],
      benefits: ["Appear below Spa", "Post up to 8 photos", "Premium support", "Priority category search", "Verified badge"],
      verified: true,
      badgeClass: "bg-indigo-100 text-indigo-800",
    },
    {
      type: "Spa",
      pricing: { 3: 800, 7: 1350, 15: 2650, 30: 4800 },
      durationOptions: [3, 7, 15, 30],
      benefits: ["Top of website", "Post up to 10 photos", "Dedicated support", "Monthly analytics", "Max search visibility"],
      verified: true,
      badgeClass: "bg-purple-100 text-purple-800",
    },
  ];

  const handleDurationChange = (type, duration) => {
    setSelectedDurations((prev) => ({ ...prev, [type]: duration }));
  };

  useEffect(() => {
    const fetchCurrentProfile = async () => {
      if (!user?._id) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/users/check-profile");
        setCurrentProfile(res.data.hasProfile ? res.data.profile : null);
        setBalance(res.data.balance || 0); // ✅ NEW: Set balance from response
      } catch (err) {
        console.error("Fetch profile error:", err);
        showToast("Could not load profile status", true);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentProfile();
  }, [user?._id]);

  // Poll for transaction status - Updated to use dedicated endpoint for direct query by CheckoutRequestID
  const pollTransactionStatus = async (checkoutRequestId) => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      // New endpoint: /api/payments/transaction-status?checkoutRequestID=...
      const res = await api.get(`/payments/transaction-status?checkoutRequestID=${checkoutRequestId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const latestTx = res.data.transaction;  
      console.log('Polling tx:', latestTx); 
      if (!latestTx) return false;

      // Safeguard: Ensure this is the correct transaction (prevents old successes from interfering)
      if (latestTx.CheckoutRequestID !== checkoutRequestId) {
        console.warn('Transaction ID mismatch! Expected:', checkoutRequestId, 'Got:', latestTx.CheckoutRequestID);
        return false; // Continue polling—don't trust mismatched tx
      }

      const expectedAmount = accountTiers.find(t => t.type === selectedType)?.pricing[selectedDurations[selectedType]];
      const expectedType = selectedType;
      if (latestTx.Amount !== expectedAmount || latestTx.accountType !== expectedType) {
        console.warn('Transaction details mismatch! Expected amount:', expectedAmount, 'type:', expectedType, 'Got:', latestTx.Amount, latestTx.accountType);
        return false; // Mismatch—likely wrong tx, continue
      }

      // Robust check: Prioritize M-Pesa resultCode if available (from callback), fallback to status
      const resultCode = latestTx.resultCode; // Safe access
      const resultDesc = latestTx.resultDesc;
      const status = latestTx.status;

      const isSuccess = resultCode === 0 || status === 'SUCCESS';
      const isFailure = (resultCode != null && resultCode !== 0) || // Only if defined and non-zero
                        status === 'FAILED' || status === 'CANCELLED' ||
                        (resultDesc && (resultDesc.includes('No response') || resultDesc.includes('Request Cancelled')));

      console.log('Status check:', { status, resultCode, resultDesc, isSuccess, isFailure, expectedAmount, expectedType }); // Enhanced debug

      if (isSuccess) {
        // Prevent premature success before user has time to enter PIN (min 10 seconds after initiation)
        if (pollStartTime && Date.now() - pollStartTime < 10000) {
          console.log('Success detected but too early—continuing poll');
          return false; // Continue polling
        }
        setPaymentStatus('success');
        showToast(`Upgraded to ${selectedType} successfully! Proration applied via wallet.`, false);
        setTimeout(() => navigate('/profile'), 2000);
        return true;
      } else if (isFailure) {
        setPaymentStatus('failed');
        showToast("Payment failed. You can retry below.", true);
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
    handleUpgrade();
  };

  // Initiate upgrade payment
  const handleUpgrade = async () => {
    if (!selectedType || paymentStatus !== 'idle') return;
    const duration = selectedDurations[selectedType];
    if (!duration) {
      showToast("Please select a duration", true);
      return;
    }
    const phone = currentProfile?.personal?.phone || "";
    if (!phone) {
      showToast("Please add a phone number in your profile first", true);
      return;
    }
    setPaymentStatus('pending');

    try {
      const token = localStorage.getItem("token");
      const tier = accountTiers.find(t => t.type === selectedType);
      if (!tier) throw new Error("Invalid tier");
      const amount = tier.pricing[duration];

      const res = await api.post("/users/payments/initiate", {
        amount,
        phone,
        accountType: selectedType,
        duration,
        profileData: {  // Minimal—backend queues full if needed; added verified for explicitness
          accountType: { type: selectedType, amount, duration, verified: tier.verified },
        },
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.requiresPayment) {
        setCheckoutRequestID(res.data.checkoutRequestID);
        setPollStartTime(Date.now()); // Start timing for minimum PIN entry delay
        showToast("Payment initiated! Check your M-Pesa for PIN prompt. Proration will be calculated after.", false);
        
        const timeoutIdLocal = setTimeout(() => {
          if (paymentStatus === 'pending') {
            clearInterval(intervalId);
            setPaymentStatus('failed');
            showToast("Payment timeout. Please try again.", true);
          }
        }, 300000);  // 5 min
        setTimeoutId(timeoutIdLocal);

        let retries = 0;
        const maxRetries = 60;  // ~5 min at 5s intervals
        const interval = setInterval(async () => {
          if (paymentStatus !== 'pending') {
            clearInterval(interval);
            clearTimeout(timeoutId);
            return;
          }
          if (++retries > maxRetries) {
            clearInterval(interval);
            clearTimeout(timeoutId);
            setPaymentStatus('failed');
            showToast("Max retries reached. Please try again.", true);
            return;
          }
          const success = await pollTransactionStatus(res.data.checkoutRequestID);
          if (success) {
            clearInterval(interval);
            clearTimeout(timeoutId);
          }
        }, 5000);

        setIntervalId(interval);
      } else {
        // Free upgrade? (unlikely post-trial)
        showToast(`Upgraded to ${selectedType} for ${duration} days successfully!`, false);
        setTimeout(() => navigate('/profile'), 1500);
      }
    } catch (err) {
      console.error("Upgrade error:", err);
      showToast(`Upgrade failed: ${err.response?.data?.error || err.message}`, true);
      setPaymentStatus('idle');
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [intervalId, timeoutId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <DotStream size="60" speed="2.5" color="#ec4899" />
          <p className="text-pink-500 font-medium">Loading upgrade options...</p>
        </div>
      </div>
    );
  }

  const currentTier = accountTiers.find(t => t.type === (currentProfile?.accountType?.type || "Regular"));
  const isOnTrial = currentProfile?.isTrial || !currentProfile;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Upgrade Your Account</h1>
          <p className="text-gray-600">
            {isOnTrial ? "Your trial is standalone—upgrade to any paid plan (Regular, VIP, VVIP, or Spa) to continue!" : "Choose your next plan."}
          </p>
        </div>

        {/* Current Status */}
        {currentProfile && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Your Current Plan</h2>
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border font-medium ${currentTier?.badgeClass}`}>
              <Crown className="w-4 h-4" />
              {currentTier?.type} {isOnTrial ? "(Trial)" : ""} – {currentProfile?.accountType?.duration || 7} days
              {currentTier?.verified && (
                <MdVerified className="w-4 h-4 text-pink-600 ml-1" />
              )}
            </span>
            {isOnTrial && (
              <p className="text-sm text-blue-600 mt-2">Standalone trial active—upgrade anytime to Regular or higher!. You cannot upgrade your current account(Selected) you can either Upgrade or degrade the account type.</p>
            )}
            {/* ✅ NEW: Balance display */}
            <p className="text-sm text-gray-600 mt-2 flex items-center justify-center gap-1">
              <DollarSign className="w-4 h-4" />
              Wallet Balance: Ksh {balance}
            </p>
          </div>
        )}

        {/* Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {accountTiers.map((tier) => {
            const selectedDuration = selectedDurations[tier.type] || tier.durationOptions[0];
            const amount = tier.pricing[selectedDuration];
            const isSelected = selectedType === tier.type;

            return (
              <div
                key={tier.type}
                className={`bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow border-2 ${
                  isSelected ? "border-pink-500 ring-2 ring-pink-200" : "border-gray-200"
                }`}
              >
                <div className="flex justify-center mb-4">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${tier.badgeClass}`}>
                    <Crown className="w-3 h-3" />
                    {tier.type}
                  </span>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    Ksh {amount}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">{selectedDuration} days</div>
                  {/* Duration Selector - Enabled always for preview; gray if not selected */}
                  <select
                    className={`w-full border rounded px-2 py-1 mb-4 text-sm ${
                      !isSelected ? 'bg-gray-50 text-gray-500' : ''
                    }`}
                    value={selectedDuration}
                    onChange={(e) => handleDurationChange(tier.type, parseInt(e.target.value))}
                    disabled={!isSelected}
                    aria-label={`Select duration for ${tier.type} upgrade`}
                  >
                    {tier.durationOptions.map((days) => (
                      <option key={days} value={days}>
                        {days} days - Ksh {tier.pricing[days]}
                      </option>
                    ))}
                  </select>
                  {/* Pricing Preview Table */}
                  <div className="mt-2 text-xs text-gray-500 mb-4 text-left">
                    <p className="text-center font-medium mb-1">Pricing Options:</p>
                    {tier.durationOptions.map((days) => (
                      <div key={days} className="flex justify-between">
                        <span>{days} days</span>
                        <span>Ksh {tier.pricing[days]}</span>
                      </div>
                    ))}
                  </div>
                  {tier.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {benefit}
                    </div>
                  ))}
                  <button
                    onClick={() => setSelectedType(tier.type === currentTier?.type ? null : tier.type)}
                    className={`w-full mt-4 py-3 rounded-lg font-medium transition-colors ${
                      isSelected
                        ? "bg-pink-500 text-white hover:bg-pink-600"
                        : tier.type === currentTier?.type && !isOnTrial
                        ? "bg-gray-500 text-white cursor-not-allowed"
                        : "bg-pink-100 text-pink-700 hover:bg-pink-200"
                    }`}
                    disabled={tier.type === currentTier?.type && !isOnTrial || isSelected}
                    aria-label={tier.type === currentTier?.type && !isOnTrial ? `Current ${tier.type} plan` : isSelected ? `Selected ${tier.type}` : `Select ${tier.type} for upgrade`}
                  >
                    {tier.type === currentTier?.type && !isOnTrial ? "Current Plan" : isSelected ? "Selected" : "Select & Upgrade"}
                  </button>
                  {tier.verified && (
                    <div className="flex items-center mt-2 text-xs text-pink-600">
                      <MdVerified className="mr-1" />
                      Verified
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        {selectedType && (
          <div className="bg-white rounded-xl shadow-sm p-6 text-center mb-8">
            <h3 className="text-xl font-semibold mb-4">Ready to upgrade to {selectedType}?</h3>
            <p className="text-gray-600 mb-4">Standalone trial ends soon—choose duration and pay for {selectedDurations[selectedType]} days. Proration will be applied automatically based on remaining days.</p>
            <button
              onClick={handleUpgrade}
              disabled={paymentStatus === 'pending'}
              className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg shadow hover:from-pink-600 hover:to-rose-600 transition-all font-medium ${
                paymentStatus === 'pending' ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              aria-label={`Upgrade to ${selectedType} for ${selectedDurations[selectedType]} days`}
            >
              <CreditCard className="w-5 h-5" />
              {paymentStatus === 'pending' ? "Processing Payment..." : `Upgrade for Ksh ${accountTiers.find(t => t.type === selectedType)?.pricing[selectedDurations[selectedType]]}`}
            </button>
            {/* ✅ NEW: Balance display in CTA */}
            <p className="text-sm text-gray-600 mt-2 flex items-center justify-center gap-1">
              <DollarSign className="w-4 h-4" />
              Current Balance: Ksh {balance}
            </p>
          </div>
        )}

        {/* Payment Status */}
        {paymentStatus === 'pending' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center" role="status" aria-live="polite">
            <p className="text-yellow-800 font-medium mb-2">⏳ Awaiting payment confirmation</p>
            <p className="text-sm text-yellow-700">Check your phone for M-Pesa PIN prompt. Request ID: {checkoutRequestID}</p>
          </div>
        )}
        {paymentStatus === 'failed' && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center" role="alert">
            <p className="text-red-800 font-medium mb-2">❌ Payment failed</p>
            <button
              onClick={handleRetry}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              aria-label="Retry payment"
            >
              <ArrowUpRight className="w-4 h-4" />
              Retry Payment
            </button>
          </div>
        )}
        {paymentStatus === 'success' && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center" role="status" aria-live="polite">
            <p className="text-green-800 font-medium mb-2">✅ Upgrade successful!</p>
            <p className="text-sm text-green-700">Proration applied. Redirecting to your profile...</p>
          </div>
        )}

        {/* Footer Link */}
        <div className="text-center">
          <Link
            to="/profile"
            className="inline-flex items-center gap-1 text-pink-600 hover:text-pink-700 text-sm"
          >
            ← Back to Profile
          </Link>
        </div>
      </div>
    </div>
  );
}