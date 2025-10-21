import { useState } from "react";

 // adjust the path if needed
export const validateAdditionalInfo = (data) => {
  const errors = {};

  if (!data.incallRate?.trim()) {
    errors.incallRate = "Incall Rate is required.";
  }

  if (!data.outcallRate?.trim()) {
    errors.outcallRate = "Outcall Rate is required.";
  }

  if (!data.description?.trim()) {
    errors.description = "Description is required.";
  } else if (data.description.trim().length < 50) {
    errors.description = "Description must be at least 20 characters.";
  }

  return errors;
};

export function StepAdditional({ data, update, errors = {} }) {
  const [touchedErrors, setTouchedErrors] = useState(errors);

  const handleChange = (e) => {
    const { name, value } = e.target;
    update({ [name]: value });
  };

  const handleBlur = () => {
    const validationErrors = validateAdditionalInfo(data);
    setTouchedErrors(validationErrors);
  };

  return (
    <div className="space-y-6 h-full">
      <h2 className="text-xl font-semibold text-pink-600 mb-2">
        Additional Information
      </h2>

      {/* Incall Rate */}
      <div>
        <label htmlFor="incallRate" className="block text-gray-700 font-medium mb-1">
          Incall Rate (Pesa utadai mwenye anakutembelea kwako) <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 text-sm">
            KES
          </span>
          <input
            id="incallRate"
            type="text"
            name="incallRate"
            value={data.incallRate || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g. 1500 or 'Ask'"
            className={`w-full pl-12 pr-4 py-2 rounded-md border ${
              touchedErrors.incallRate
                ? "border-red-400 focus:ring-red-300"
                : "border-pink-300 focus:ring-pink-300"
            } focus:outline-none focus:ring-2 transition`}
          />
        </div>
        {touchedErrors.incallRate && (
          <p className="text-red-500 text-sm mt-1">{touchedErrors.incallRate}</p>
        )}
      </div>

      {/* Outcall Rate */}
      <div>
        <label htmlFor="outcallRate" className="block text-gray-700 font-medium mb-1">
          Outcall Rate (Pesa utadai mwenye unaenda kwake) <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 text-sm">
            KES
          </span>
          <input
            id="outcallRate"
            type="text"
            name="outcallRate"
            value={data.outcallRate || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g. 2000 or 'Ask'"
            className={`w-full pl-12 pr-4 py-2 rounded-md border ${
              touchedErrors.outcallRate
                ? "border-red-400 focus:ring-red-300"
                : "border-pink-300 focus:ring-pink-300"
            } focus:outline-none focus:ring-2 transition`}
          />
        </div>
        {touchedErrors.outcallRate && (
          <p className="text-red-500 text-sm mt-1">{touchedErrors.outcallRate}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-gray-700 font-medium mb-1">
          Description(Jieleze, unapenda nini, unakaa aje..) <span className="text-red-500">*</span>
          <span className="text-sm text-gray-500 ml-1">(min 50 characters)</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={data.description || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          minLength={20}
          placeholder="Tell us more about yourself…(Jieleze kwa undani)"
          className={`w-full px-4 py-3 rounded-md border ${
            touchedErrors.description
              ? "border-red-400 focus:ring-red-300"
              : "border-pink-300 focus:ring-pink-300"
          } focus:outline-none focus:ring-2 transition`}
          rows={5}
        />
        {touchedErrors.description && (
          <p className="text-red-500 text-sm mt-1">{touchedErrors.description}</p>
        )}
      </div>
    </div>
  );
}
