import { useState } from "react";
import { motion } from "framer-motion";
import { ImCheckboxUnchecked, ImCheckboxChecked } from "react-icons/im";
import toast from "react-hot-toast";

export const validateServices = (data) => {
  const errors = {};

  if (!data.selected || (data.selected || []).length === 0) {  // ✅ Minor: Explicit default to []
    errors.selected = "Please select at least one service.";
  }

  return errors;
};

const defaultServices = [
  "Blowjob and Handjob",
  "Bathroom Experience",
  "Group Sex",
  "Threesome",
  "Steam Bath",
  "Erotic Massage or Massage with Extra",
  "Barbershop/Waxing",
  "Lesbian Shows",
  "Outcall only",
  "Incall Only",
  "Incall and Outcall",
  "Raw Blowjob",
  "Deep tissue massage",
  "Anal Sex",
  "Ass Licking",
  "Hotel/Home services",
  "Nudes",
  "Video Calls",
  "Gay Sex",
  "Girls Only",
  "Boys Only",
  "Pussy fucking Only",
  "RimJobs",
  "Deepthroat",
  "No anal sex",
  "Rimming",
];

export function StepServices({ data, update }) {
  const [services, setServices] = useState(defaultServices);
  const [customService, setCustomService] = useState("");

  const toggleService = (service) => {
    const current = data.selected || [];
    const newServices = current.includes(service)
      ? current.filter((s) => s !== service)
      : [...current, service];

    // ✅ store under "selected"
    update({ selected: newServices });
  };

  const handleAddCustomService = () => {
    const trimmed = customService.trim();
    if (!trimmed) return;

    if (!services.includes(trimmed)) {
      setServices((prev) => [...prev, trimmed]);
      setCustomService("");
      // ✅ also add to selected
      update({ selected: [...(data.selected || []), trimmed], custom: trimmed });
      toast.success("Your custom service was added!");
    } else {
      toast.error("This service already exists.");
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Select Services</h2>
      <p className="text-sm text-gray-600">
        Choose from the list below or add your own service if it’s not listed.(Chagua😉🥵🥵)
      </p>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {services.map((service, index) => {
          // ✅ Fix: Always default to [] so isSelected is boolean (false if undefined)
          const isSelected = (data.selected || []).includes(service);
          return (
            <motion.label
              key={index}
              className={`flex items-center border rounded-lg p-3 cursor-pointer shadow-sm transition ${
                isSelected
                  ? "border-pink-500 bg-pink-50"
                  : "border-gray-300 hover:border-pink-300"
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.02 }}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleService(service)}
                className="hidden"
              />
              {isSelected ? (
                <ImCheckboxChecked className="text-pink-500 mr-2 text-lg" />
              ) : (
                <ImCheckboxUnchecked className="text-gray-500 mr-2 text-lg" />
              )}
              <span
                className={`text-sm ${
                  isSelected ? "text-pink-700 font-medium" : "text-gray-800"
                }`}
              >
                {service}
              </span>
            </motion.label>
          );
        })}
      </div>

      {/* Custom Service Input */}
      <div className="pt-4 border-t">
        <label className="block text-gray-700 font-medium mb-2">
          Add Your Own Service
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Enter custom service name"
            value={customService}
            onChange={(e) => setCustomService(e.target.value)}
          />
          <button
            onClick={handleAddCustomService}
            type="button"
            className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}