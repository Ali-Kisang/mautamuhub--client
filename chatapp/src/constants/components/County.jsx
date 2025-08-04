import { useState } from "react";

import kenyaLocations from "../kenyaLocations";
const data = kenyaLocations;
const BreadcrumbNavigation = () => {
  const [currentLevel, setCurrentLevel] = useState("counties");
  const [selectedCounty, setSelectedCounty] = useState(null);
  const [selectedConstituency, setSelectedConstituency] = useState(null);

  // Handler for county selection
  const handleCountyClick = (county) => {
    setSelectedCounty(county);
    setCurrentLevel("constituencies");
  };

  // Handler for constituency selection
  const handleConstituencyClick = (constituency) => {
    setSelectedConstituency(constituency);
    setCurrentLevel("wards");
  };

  // Handler for breadcrumb navigation
  const resetToLevel = (level) => {
    if (level === "counties") {
      setSelectedCounty(null);
      setSelectedConstituency(null);
    } else if (level === "constituencies") {
      setSelectedConstituency(null);
    }
    setCurrentLevel(level);
  };

  return (
    <div className="container mx-auto p-4 py-14 ">
      {/* Breadcrumbs */}
      <div className="flex gap-2 text-sm mb-4">
        <button
          onClick={() => resetToLevel("counties")}
          className={`hover:underline ${
            currentLevel === "counties" ? "font-bold" : ""
          }`}
        >
          Counties
        </button>
        {selectedCounty && (
          <>
            <span>&gt;</span>
            <button
              onClick={() => resetToLevel("constituencies")}
              className={`hover:underline ${
                currentLevel === "constituencies" ? "font-bold" : ""
              }`}
            >
              {selectedCounty.name}
            </button>
          </>
        )}
        {selectedConstituency && (
          <>
            <span>&gt;</span>
            <span className="font-bold">{selectedConstituency.name}</span>
          </>
        )}
      </div>

      {/* Content */}
      <div>
        {currentLevel === "counties" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 ">
            {data.map((county) => (
              <button
                key={county.countyCode}
                onClick={() => handleCountyClick(county)}
                className="block p-4  hover:bg-pink rounded shadow duration-300 scale-105"
              >
                {county.name}
              </button>
            ))}
          </div>
        )}

        {currentLevel === "constituencies" && selectedCounty && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {selectedCounty.constituencies.map((constituency, index) => (
              <button
                key={index}
                onClick={() => handleConstituencyClick(constituency)}
                className="block p-4  hover:bg-pink rounded shadow "
              >
                {constituency.name}
              </button>
            ))}
          </div>
        )}

        {currentLevel === "wards" && selectedConstituency && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {selectedConstituency.wards.map((ward, index) => (
              <div
                key={index}
                className="block p-4 hover:bg-pink  rounded shadow cursor-pointer "
              >
                {ward}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BreadcrumbNavigation;
