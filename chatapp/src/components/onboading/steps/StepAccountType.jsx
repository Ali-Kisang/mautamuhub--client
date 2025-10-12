/* eslint-disable react-refresh/only-export-components */

import { useState } from "react";
import { motion } from "framer-motion";
import { MdVerified } from "react-icons/md";
import { FaCircleDot } from "react-icons/fa6";
import { showToast } from "../../utils/showToast";

export const validateAccountType = (data) => {
  const errors = {};

  if (!data?.type) {
    errors.type = "Please select an account type.";
  }

  return errors;
};

const StepAccountType = ({ selected, setSelected }) => {
  const accountTypes = [
    {
      type: "Spa",
      pricing: { 3: 800, 7: 1350, 15: 2650, 30: 4800 },
      details: [
        "Appear at the top of the website",
        "Post up to 10 photos",
        "Priority service",
        "Real-time chat with clients",
        "Dedicated customer support",
        "Free monthly analytics report",
        "Increased visibility in search results",
      ],
      verified: true,
      trialNote: "Start with free 7-day Spa trial!",
    },
    {
      type: "VVIP",
      pricing: { 3: 500, 7: 1150, 15: 2300, 30: 3800 },
      details: [
        "Appear below Spa's",
        "Post up to 8 photos",
        "Real-time chat with clients",
        "Access to premium support",
        "Priority placement in category search",
      ],
      verified: true,
      trialNote: "Start with free 7-day VVIP trial!",
    },
    {
      type: "VIP",
      pricing: { 3: 1, 7: 850, 15: 1650, 30: 2800 },
      details: [
        "Appear at the top of each County",
        "Post up to 6 photos",
        "Real-time chat with clients",
        "Not Verified",
        "Access to standard customer support",
        "Featured placement in local search",
      ],
      verified: false,
      trialNote: "Start with free 7-day VIP trial!",
    },
    {
      type: "Regular",
      pricing: { 3: 350, 7: 650, 15: 1250, 30: 1800 },
      details: [
        "Appear below VIP",
        "Post up to 4 images",
        "Real-time chat with clients",
        "Not Verified",
        "Basic customer support",
        "Basic search visibility",
      ],
      verified: false,
      trialNote: "Start with free 7-day Regular trial!",
    },
  ];

  const [selectedDurations, setSelectedDurations] = useState({});

  const handleDurationChange = (type, duration) => {
    setSelectedDurations((prev) => ({ ...prev, [type]: duration }));
  };

  const handleSelection = (type) => {
    // ✅ For standalone trial: Override to free 7-day (backend confirms first-time)
    setSelected({ type, amount: 0, duration: 7 }); 
    showToast(
      `✅ ${accountTypes.find((acc) => acc.type === type).trialNote} After trial, upgrade to any plan (Regular, VIP, VVIP, or Spa) anytime!`
    );
  };

  return (
    <div>
      <h2 className="text-2xl text-pink-600 font-semibold mb-6">
        Select Your Account Type
      </h2>
      <p className="text-gray-600 mb-6 text-center">
        Choose your starting tier—get a free 7-day trial! Upgrade later to extend with paid plans.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {accountTypes.map((account, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative p-6 border rounded-lg shadow-md transition-all cursor-pointer ${
              selected?.type === account.type
                ? "border-pink-300 shadow-lg"
                : "border-gray-300"
            }`}
            onClick={() => handleSelection(account.type)}  // ✅ Direct select for trial
          >
            {account.type === "VIP" && (
              <span className="absolute top-2 left-2 bg-pink-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                MOST POPULAR
              </span>
            )}

            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold">{account.type}</h3>
              <FaCircleDot
                className={`text-lg rounded-full ${
                  selected?.type === account.type
                    ? "text-white bg-pink-600"
                    : "text-pink-600 bg-gray-100"
                }`}
              />
            </div>

            {/* ✅ Trial Note (standalone free start) */}
            <div className="bg-pink-50 border border-pink-200 rounded-md p-3 mb-4">
              <p className="text-pink-800 font-medium text-sm text-center">
                {account.trialNote}
              </p>
            </div>

            {/* Paid Pricing (post-trial reference) */}
            <div className="mb-4 text-center">
              <p className="text-xs text-gray-500 mb-1">After trial, renew for:</p>
              <div className="space-y-1">
                {Object.entries(account.pricing).map(([days, price]) => (
                  <p key={days} className="text-xs text-gray-600">
                    {days} days: Ksh {price}
                  </p>
                ))}
              </div>
            </div>

            {/* ✅ Button for trial start */}
            <button
              className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-2 rounded-md mb-4 font-medium hover:from-pink-600 hover:to-pink-700 transition-colors"
              disabled={selected?.type === account.type}  // Disable if selected
            >
              {selected?.type === account.type ? "Selected (Free Trial)" : "Start Free Trial"}
            </button>

            <div className="flex items-center mb-4">
              {account.verified && (
                <MdVerified className="text-pink-600 mr-2 text-xl" />
              )}
              <p className="text-sm">
                {account.verified ? "Verified Account" : "Not Verified"}
              </p>
            </div>

            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
              {account.details.map((detail, i) => (
                <li className="m-0" key={i}>
                  {detail}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>After your trial, upgrade to Regular, VIP, VVIP, or Spa anytime via your profile.</p>
      </div>
    </div>
  );
};

export default StepAccountType;