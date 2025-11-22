import { useEffect, useState, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Crown, CreditCard, CheckCircle, DollarSign, Phone } from "lucide-react";
import { MdVerified } from "react-icons/md";

import { useAuthStore } from "../../../store/useAuthStore";
import api from "../../../utils/axiosInstance";
import { showToast } from "../../utils/showToast";
import { DotStream } from "ldrs/react";

export default function UpgradeAccount() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [currentProfile, setCurrentProfile] = useState(null);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const [selectedType, setSelectedType] = useState(null);
  const [selectedDurations, setSelectedDurations] = useState({});

  const [paymentStatus, setPaymentStatus] = useState("idle"); // idle | pending | success | failed
  const [checkoutRequestID, setCheckoutRequestID] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);

  // Phone modal
  const [showPhonePrompt, setShowPhonePrompt] = useState(false);
  const [enteredPhone, setEnteredPhone] = useState("");
  const [promptMessage, setPromptMessage] = useState("");
  const [onPhoneSubmit, setOnPhoneSubmit] = useState(null);
  const [cooldown, setCooldown] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  // All updated Safaricom prefixes (2025)
const safaricomPrefixes = useMemo(
  () =>
    new Set([
      // 0700–0709
      '0700','0701','0702','0703','0704','0705','0706','0707','0708','0709',

      // 0710–0719
      '0710','0711','0712','0713','0714','0715','0716','0717','0718','0719',

      // 0720–0729
      '0720','0721','0722','0723','0724','0725','0726','0727','0728','0729',

      // 0740–0749
      '0740','0741','0742','0743','0744','0745','0746','0747','0748','0749',

      // 0750–0759
      // Safaricom owns 0757–0759 but has expanded new allocations
      '0750','0751','0752','0753','0754','0755','0756','0757','0758','0759',

      // 0760–0769
      // Safaricom uses 0768–0769 but newer blocks include whole 076 range
      '0760','0761','0762','0763','0764','0765','0766','0767','0768','0769',

      // 0790–0799
      '0790','0791','0792','0793','0794','0795','0796','0797','0798','0799',

      // 0110–0119
      '0110','0111','0112','0113','0114','0115','0116','0117','0118','0119'
    ]),
  []
);


  // Cooldown timer
  useEffect(() => {
    if (cooldown === 0) return;
    const timer = setInterval(() => setCooldown(c => Math.max(0, c - 1)), 1000);
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
    if (!localPhone?.startsWith('0')) return null;
    return '254' + localPhone.substring(1);
  }, []);

  const isSafaricom = useCallback((normalized) => {
    if (!normalized || normalized.length !== 10) return false;
    return safaricomPrefixes.has(normalized.substring(0, 4));
  }, [safaricomPrefixes]);

  const profilePhone = currentProfile?.personal?.phone || "";
  const normalizedProfilePhone = normalizePhone(profilePhone);
  const hasValidProfilePhone = !!normalizedProfilePhone && isSafaricom(normalizedProfilePhone);

  const accountTiers = [
    { type: "Regular", pricing: { 3: 350, 7: 650, 15: 1250, 30: 1800 }, durationOptions: [3, 7, 15, 30], benefits: ["Basic visibility", "Up to 4 photos", "Standard matching", "Basic support"], verified: false, badgeClass: "bg-gray-100 text-gray-800" },
    { type: "VIP", pricing: { 3: 450, 7: 850, 15: 1650, 30: 2800 }, durationOptions: [3, 7, 15, 30], benefits: ["Priority search", "Up to 6 photos", "Real-time chat", "Featured"], verified: false, badgeClass: "bg-yellow-100 text-yellow-800" },
    { type: "VVIP", pricing: { 3: 500, 7: 1150, 15: 2300, 30: 3800 }, durationOptions: [3, 7, 15, 30], benefits: ["Below Spa", "Up to 8 photos", "Premium support", "Verified badge"], verified: true, badgeClass: "bg-indigo-100 text-indigo-800" },
    { type: "Spa", pricing: { 3: 800, 7: 1350, 15: 2650, 30: 4800 }, durationOptions: [3, 7, 15, 30], benefits: ["Top placement", "Up to 10 photos", "Dedicated support", "Analytics"], verified: true, badgeClass: "bg-purple-100 text-purple-800" },
  ];

  const handleDurationChange = (type, duration) => {
    setSelectedDurations(prev => ({ ...prev, [type]: duration }));
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user?._id) return setLoading(false);
      try {
        const res = await api.get("/users/check-profile");
        setCurrentProfile(res.data.hasProfile ? res.data.profile : null);
        setBalance(Number(res.data.balance || 0));
      } catch (err) {
        showToast("Failed to load profile", true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?._id]);

  const pollTransactionStatus = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get(`/payments/transaction-status?checkoutRequestID=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const tx = res.data.transaction;
      if (!tx || tx.CheckoutRequestID !== id) return false;

      const expectedAmount = accountTiers.find(t => t.type === selectedType)?.pricing[selectedDurations[selectedType]];
      if (tx.Amount !== expectedAmount || tx.accountType !== selectedType) return false;

      if (tx.resultCode === 0 || tx.status === "SUCCESS") {
        setPaymentStatus("success");
        showToast(`Upgraded to ${selectedType}!`, false);
        setTimeout(() => navigate("/profile"), 2000);
        return true;
      } else if (["FAILED", "CANCELLED"].includes(tx.status) || (tx.resultCode != null && tx.resultCode !== 0)) {
        setPaymentStatus("failed");
        showToast(tx.resultDesc || "Payment failed or cancelled", true);
        setCooldown(30);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const initiatePayment = async (mpesaPhone, amount, duration) => {
    if (cooldown > 0) {
      showToast(`Please wait ${cooldown}s before retrying`, true);
      return;
    }

    setPaymentStatus("pending");
    setErrorMsg("");

    try {
      const token = localStorage.getItem("token");
      const tier = accountTiers.find(t => t.type === selectedType);

      const res = await api.post("/users/payments/initiate", {
        amount,
        phone: mpesaPhone,
        accountType: selectedType,
        duration,
        profileData: { accountType: { type: selectedType, amount, duration, verified: tier.verified } },
      }, { headers: { Authorization: `Bearer ${token}` } });

      if (res.data.requiresPayment) {
        setCheckoutRequestID(res.data.checkoutRequestID);

        const timeout = setTimeout(() => {
          if (paymentStatus === "pending") {
            setPaymentStatus("failed");
            showToast("Payment timeout", true);
            setCooldown(30);
          }
        }, 300000);
        setTimeoutId(timeout);

        const interval = setInterval(async () => {
          if (paymentStatus !== "pending") {
            clearInterval(interval);
            clearTimeout(timeout);
            return;
          }
          const done = await pollTransactionStatus(res.data.checkoutRequestID);
          if (done) {
            clearInterval(interval);
            clearTimeout(timeout);
          }
        }, 5000);
        setIntervalId(interval);

      } else {
        showToast("STK Push sent! Check your phone", false);
        //showToast("Upgrade successful!", false);
        setTimeout(() => navigate("/profile"), 5000);
      }
    } catch (err) {
      showToast(err.response?.data?.error || "Payment failed", true);
      setPaymentStatus("idle");
      setCooldown(30);
    }
  };

  const payWithProfileNumber = async () => {
    if (!hasValidProfilePhone) return;
    const duration = selectedDurations[selectedType];
    const amount = accountTiers.find(t => t.type === selectedType).pricing[duration];
    const mpesaPhone = getMpesaPhone(normalizedProfilePhone);
    await initiatePayment(mpesaPhone, amount, duration);
  };

  const payWithCustomNumber = () => {
    const duration = selectedDurations[selectedType];
    const amount = accountTiers.find(t => t.type === selectedType).pricing[duration];

    setPromptMessage(`Enter Safaricom number to pay Ksh ${amount} for ${selectedType} (${duration} days)`);
    setEnteredPhone("");
    setOnPhoneSubmit(() => async (localPhone) => {
      const mpesaPhone = getMpesaPhone(localPhone);
      await initiatePayment(mpesaPhone, amount, duration);
      setShowPhonePrompt(false);
    });
    setShowPhonePrompt(true);
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
        <div className="flex flex-col items-center gap-4">
          <DotStream size="60" speed="2.5" color="#ec4899" />
          <p className="text-pink-600 font-medium">Loading upgrade options...</p>
        </div>
      </div>
    );
  }

  const currentTierType = currentProfile?.accountType?.type || "Regular";
  const currentTierDuration = currentProfile?.accountType?.duration || 0;
  const currentTier = accountTiers.find(t => t.type === currentTierType);
  const isOnTrial = currentProfile?.isTrial || !currentProfile;

  const getButtonProps = (tier) => {
    const selDur = selectedDurations[tier.type] || tier.durationOptions[0];
    const samePlan = tier.type === currentTierType && selDur === currentTierDuration && !isOnTrial;
    const selected = selectedType === tier.type;
    if (samePlan) return { text: "Current Plan", disabled: true };
    if (selected) return { text: tier.type === currentTierType ? "Extend Duration" : `Upgrade to ${tier.type}`, disabled: false };
    return { text: "Select Plan", disabled: false };
  };

  const formatBalance = (v) => (Number(v) || 0).toLocaleString();
  const normalizedEntered = normalizePhone(enteredPhone);
  const isValidCustomPhone = !!normalizedEntered && isSafaricom(normalizedEntered);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">Upgrade or Extend Your Account</h1>
          <p className="text-lg text-gray-600">
            {isOnTrial ? "Your trial is active — upgrade now!" : "Choose your next plan"}
          </p>
        </div>

        {/* Current Plan */}
        {currentProfile && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 text-center">
            <h2 className="text-2xl font-semibold mb-4">Your Current Plan</h2>
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full text-lg font-bold border-2 border-pink-200">
              <Crown className="w-6 h-6" />
              {currentTierType} {isOnTrial && "(Trial)"}
              {currentTier?.verified && <MdVerified className="w-6 h-6 text-pink-600" />}
            </div>
            {!isOnTrial && <p className="text-gray-600 mt-2">{currentTierDuration} days active</p>}
            <p className="mt-5 text-gray-700 flex items-center justify-center gap-2">
              <DollarSign className="w-5 h-5" />
              Wallet Balance: <strong>Ksh {formatBalance(balance)}</strong>
            </p>
          </div>
        )}

        {/* Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {accountTiers.map(tier => {
            const dur = selectedDurations[tier.type] || tier.durationOptions[0];
            const amount = tier.pricing[dur];
            const selected = selectedType === tier.type;
            const { text, disabled } = getButtonProps(tier);

            return (
              <div key={tier.type} className={`bg-white rounded-2xl shadow-lg border-4 transition-all ${selected ? "border-pink-500 ring-4 ring-pink-100" : "border-gray-200"}`}>
                <div className="p-6">
                  <div className="text-center mb-4">
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${tier.badgeClass}`}>
                      <Crown className="w-5 h-5" /> {tier.type}
                    </span>
                  </div>
                  <div className="text-center mb-5">
                    <div className="text-4xl font-bold">Ksh {amount.toLocaleString()}</div>
                    <div className="text-gray-600">{dur} days</div>
                  </div>

                  <select
                    className={`w-full mb-5 px-4 py-3 border rounded-lg text-center ${selected ? "border-pink-500 bg-pink-50" : "border-gray-300"}`}
                    value={dur}
                    onChange={e => handleDurationChange(tier.type, parseInt(e.target.value))}
                    disabled={!selected}
                  >
                    {tier.durationOptions.map(d => (
                      <option key={d} value={d}>{d} days — Ksh {tier.pricing[d].toLocaleString()}</option>
                    ))}
                  </select>

                 <ul className="space-y-3 mb-6 text-sm">
  {tier.benefits.map((b, i) => (
    <li key={i} className="flex items-start gap-2">
      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
      <span>{b}</span>
    </li>
  ))}
</ul>

                  {tier.verified && <div className="text-center text-pink-600 font-medium mb-4"><MdVerified className="inline w-6 h-6" /> Verified</div>}

                  <button
                    onClick={() => setSelectedType(tier.type)}
                    disabled={disabled}
                    className={`w-full py-4 rounded-lg font-bold text-lg ${disabled ? "bg-gray-400 text-gray-700" : selected ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white" : "bg-pink-100 text-pink-700 hover:bg-pink-200"}`}
                  >
                    {text}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Payment Options */}
        {selectedType && (
          <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold mb-6">
              {selectedType === currentTierType ? "Extend" : "Upgrade to"} {selectedType}
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              {selectedDurations[selectedType]} days • Ksh {accountTiers.find(t => t.type === selectedType)?.pricing[selectedDurations[selectedType]]?.toLocaleString()}
            </p>

            <div className="space-y-4">
              {/* Use Profile Number */}
              <button
                onClick={payWithProfileNumber}
                disabled={!hasValidProfilePhone || paymentStatus === "pending" || cooldown > 0}
                className={`w-full py-5 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                  !hasValidProfilePhone || paymentStatus === "pending" || cooldown > 0
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg"
                }`}
              >
                <Phone className="w-6 h-6" />
                {hasValidProfilePhone ? `Use Profile Number (${profilePhone})` : "No Valid Phone in Profile"}
              </button>

              {/* Or Enter Another */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-4 text-gray-500">OR</span>
                </div>
              </div>

              <button
                onClick={payWithCustomNumber}
                disabled={paymentStatus === "pending" || cooldown > 0}
                className={`w-full py-5 rounded-xl font-bold text-lg flex items-center justify-center gap-3 border-2 transition-all ${
                  paymentStatus === "pending" || cooldown > 0
                    ? "border-gray-300 text-gray-500 cursor-not-allowed"
                    : "border-pink-500 text-pink-700 hover:bg-pink-50"
                }`}
              >
                <Phone className="w-6 h-6" />
                Enter Another Safaricom Number
              </button>
            </div>

            {cooldown > 0 && <p className="mt-4 text-sm text-gray-600">Retry in {cooldown}s</p>}
          </div>
        )}

        {/* Status Messages */}
        {paymentStatus === "pending" && (
          <div className="mt-10 bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6 text-center">
            <p className="text-yellow-800 font-bold text-lg">Awaiting Payment</p>
            <p className="text-sm mt-2">Check your phone • Request ID: {checkoutRequestID}</p>
          </div>
        )}

        {paymentStatus === "failed" && (
          <div className="mt-10 bg-red-50 border-2 border-red-300 rounded-xl p-6 text-center">
            <p className="text-red-800 font-bold text-lg">Payment Failed</p>
            <button onClick={() => setPaymentStatus("idle")} className="mt-4 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700">
              Try Again {cooldown > 0 && `(in ${cooldown}s)`}
            </button>
          </div>
        )}

        {/* Phone Modal */}
        {showPhonePrompt && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold mb-4">Enter Safaricom Number</h3>
              <p className="text-gray-600 mb-4">{promptMessage}</p>
              <input
                type="tel"
                placeholder="07xxxxxxxx or 01xxxxxxxx"
                value={enteredPhone}
                onChange={e => setEnteredPhone(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 mb-4"
                autoFocus
              />
              {errorMsg && <p className="text-red-500 text-sm mb-3">{errorMsg}</p>}
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowPhonePrompt(false)} className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (!isValidCustomPhone) return setErrorMsg("Invalid Safaricom number");
                    await onPhoneSubmit(normalizedEntered);
                  }}
                  disabled={!isValidCustomPhone || paymentStatus === "pending"}
                  className="px-5 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:bg-gray-300 flex items-center gap-2"
                >
                  {paymentStatus === "pending" ? <DotStream size={16} color="white" /> : "Send STK Push"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mt-12">
          <Link to="/profile" className="text-pink-600 hover:text-pink-700 font-medium text-lg">
            ← Back to Profile
          </Link>
        </div>
      </div>
    </div>
  );
}