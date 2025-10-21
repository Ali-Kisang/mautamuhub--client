/* eslint-disable no-unused-vars */

import { useState } from "react";
import { motion } from "framer-motion";

import { IoIosArrowDroprightCircle } from "react-icons/io";
import kenyaLocations from "../../utils/kenyaLocations";

export const validateLocation = (data) => {
  const errors = {};

  if (!data.county?.trim()) {
    errors.county = "County is required.";
  }

  if (!data.constituency?.trim()) {
    errors.constituency = "Constituency is required.";
  }

  if (!data.ward?.trim()) {
    errors.ward = "Ward is required.";
  }

  return errors;
};



export  function StepLocation({ data, update }) {
  const [currentLevel, setCurrentLevel] = useState("counties");
  const [selectedCounty, setSelectedCounty] = useState(null);
  const [selectedConstituency, setSelectedConstituency] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);

  // Helper to update state in Zustand
  const handleUpdate = (key, value) => {
    update({ [key]: value });
  };

  const handleCountyClick = (county) => {
    setSelectedCounty(county);
    setCurrentLevel("constituencies");
    handleUpdate("county", county.name);
    // Reset deeper levels
    handleUpdate("constituency", "");
    handleUpdate("ward", "");
  };

  const handleConstituencyClick = (constituency) => {
    setSelectedConstituency(constituency);
    setCurrentLevel("wards");
    handleUpdate("constituency", constituency.name);
    handleUpdate("ward", "");
  };

  const handleWardClick = (ward) => {
    setSelectedWard(ward);
    handleUpdate("ward", ward);
  };

  const resetToLevel = (level) => {
    if (level === "counties") {
      setSelectedCounty(null);
      setSelectedConstituency(null);
      setSelectedWard(null);
      handleUpdate("county", "");
      handleUpdate("constituency", "");
      handleUpdate("ward", "");
    } else if (level === "constituencies") {
      setSelectedConstituency(null);
      setSelectedWard(null);
      handleUpdate("constituency", "");
      handleUpdate("ward", "");
    } else if (level === "wards") {
      setSelectedWard(null);
      handleUpdate("ward", "");
    }
    setCurrentLevel(level);
  };

  

  return (
    <div className="p-4 h-full">
      <h2 className="text-lg font-semibold text-pink-600 mb-4">Select Location</h2>

      {/* Breadcrumb */}
      <div className="flex gap-2 text-sm mb-4 items-center">
        <button
          onClick={() => resetToLevel("counties")}
          className={`hover:underline ${
            currentLevel === "counties" ? "font-semibold text-pink-600" : ""
          }`}
        >
          Counties
        </button>
        {selectedCounty && (
          <>
            <IoIosArrowDroprightCircle className="text-pink-600" />
            <button
              onClick={() => resetToLevel("constituencies")}
              className={`hover:underline ${
                currentLevel === "constituencies"
                  ? "font-semibold text-pink-600"
                  : ""
              }`}
            >
              {selectedCounty.name}
            </button>
          </>
        )}
        {selectedConstituency && (
          <>
            <IoIosArrowDroprightCircle className="text-pink-600" />
            <span className="font-bold">{selectedConstituency.name}</span>
          </>
        )}
      </div>

      {/* Counties */}
      {currentLevel === "counties" && (
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {kenyaLocations.map((county) => (
            <motion.button
              key={county.countyCode}
              onClick={() => handleCountyClick(county)}
              className={`block p-4 border rounded shadow transition-colors duration-300 ${
                selectedCounty?.name === county.name
                  ? "border-pink-300 bg-pink/10"
                  : "border-gray-300 hover:bg-pink/5"
              }`}
              whileHover={{ scale: 1.05 }}
            >
              {county.name}
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Constituencies */}
      {currentLevel === "constituencies" && selectedCounty && (
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {selectedCounty.constituencies.map((constituency, idx) => (
            <motion.button
              key={idx}
              onClick={() => handleConstituencyClick(constituency)}
              className={`block p-4 border rounded shadow transition-colors duration-300 ${
                selectedConstituency?.name === constituency.name
                  ? "border-pink-300 bg-pink/10"
                  : "border-gray-300 hover:bg-pink/5"
              }`}
              whileHover={{ scale: 1.05 }}
            >
              {constituency.name}
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Wards */}
      {currentLevel === "wards" && selectedConstituency && (
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {selectedConstituency.wards.map((ward, idx) => (
            <motion.button
              key={idx}
              onClick={() => handleWardClick(ward)}
              className={`block p-4 border rounded shadow transition-colors duration-300 ${
                selectedWard === ward
                  ? "border-pink-300 bg-pink/10"
                  : "border-gray-300 hover:bg-pink/5"
              }`}
              whileHover={{ scale: 1.05 }}
            >
              {ward}
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Road & Local area */}
      {currentLevel === "wards" && (
        <motion.div
          className="mt-6 space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div>
            <label htmlFor="localArea" className="block text-sm font-medium mb-2">
              Local Area (Mtaa unaishi sahii) <span className="text-pink-600">(Optional)</span>
            </label>
            <input
              id="localArea (Mtaa yako)"
              type="text"
              placeholder="e.g. Caltex Donholm"
              value={data.localArea || ""}
              onChange={(e) => handleUpdate("localArea", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink focus:border-pink-300 transition"
            />
          </div>
          <div>
            <label htmlFor="roadStreet" className="block text-sm font-medium mb-2">
              Road/Street/Landmark (Ama jengo gani karibu) <span className="text-pink-600">(Optional)</span>
            </label>
            <input
              id="roadStreet"
              type="text"
              placeholder="e.g. Donholm Savannah Road"
              value={data.roadStreet || ""}
              onChange={(e) => handleUpdate("roadStreet", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink focus:border-pink-300 transition"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}
