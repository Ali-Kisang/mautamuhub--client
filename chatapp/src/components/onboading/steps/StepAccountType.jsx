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
    },
    {
      type: "VIP",
      pricing: { 3: 450, 7: 850, 15: 1650, 30: 2800 },
      details: [
        "Appear at the top of each County",
        "Post up to 6 photos",
        "Real-time chat with clients",
        "Not Verified",
        "Access to standard customer support",
        "Featured placement in local search",
      ],
      verified: false,
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
    },
  ];

  const [selectedDurations, setSelectedDurations] = useState({});

  const handleDurationChange = (type, duration) => {
    setSelectedDurations((prev) => ({ ...prev, [type]: duration }));
  };

  const handleSelection = (type, amount, duration) => {
    setSelected({ type, amount, duration }); // ✅ store selected accountType object
    const account = accountTypes.find((acc) => acc.type === type);
    if (account) {
      showToast(
        `✅ You selected a ${type} account for ${duration} days. ${account.details[0]}`
      );
    }
  };

  return (
    <div>
      <h2 className="text-2xl text-pink-600 font-semibold mb-6">
        Select Your Account Type
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {accountTypes.map((account, index) => {
          const selectedDuration = selectedDurations[account.type] || 3;
          const amount = account.pricing[selectedDuration];

          return (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative p-6 border rounded-lg shadow-md transition-all cursor-pointer ${
                selected?.type === account.type
                  ? "border-pink-300 shadow-lg"
                  : "border-gray-300"
              }`}
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

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Select Duration:
                </label>
                <select
                  className="w-full border rounded px-2 py-1"
                  value={selectedDuration}
                  onChange={(e) =>
                    handleDurationChange(account.type, parseInt(e.target.value))
                  }
                >
                  {Object.keys(account.pricing).map((days) => (
                    <option key={days} value={days}>
                      {days} Days - Ksh. {account.pricing[days]}
                    </option>
                  ))}
                </select>
              </div>

              <button
                className="w-full bg-pink-600 text-gray-800 py-2 rounded-md mb-4"
                onClick={() =>
                  handleSelection(account.type, amount, selectedDuration)
                }
              >
                SELECT
              </button>

              <div className="flex items-center mb-4">
                {account.verified && (
                  <MdVerified className="text-pink-600 mr-2 text-xl" />
                )}
                <p className="text-sm">
                  {account.verified ? "Verified Account" : "Not Verified"}
                </p>
              </div>

              <ul className="text-sm text-gray-600 list-disc list-inside">
                {account.details.map((detail, i) => (
                  <li className="m-2" key={i}>
                    {detail}
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default StepAccountType;
