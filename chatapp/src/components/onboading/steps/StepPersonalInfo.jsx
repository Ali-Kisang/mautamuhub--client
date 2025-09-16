/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect } from "react";
import { useAuthStore } from "../../../store/useAuthStore";

// ✅ Validation function for use in OnBoarding and internal checks
export const validatePersonalInfo = (data) => {
  const errors = {};

 

  if (!data.phone?.trim()) {
    errors.phone = "Phone number is required.";
  }

  if (!data.gender) {
    errors.gender = "Gender is required.";
  }

  const age = parseInt(data.age, 10);
  if (!age || age < 18) {
    errors.age = "Age must be at least 18.";
  }

  if (!data.orientation) {
    errors.orientation = "Orientation is required.";
  }

  if (data.orientation === "Other" && !data.customOrientation?.trim()) {
    errors.customOrientation = "Please specify your orientation.";
  }

  return errors;
};

export function StepPersonalInfo({ data, update, errors = {} }) {
  const [orientation, setOrientation] = useState(data.orientation || "");
  const [customOrientation, setCustomOrientation] = useState(data.customOrientation || "");
 const { user } = useAuthStore();
  // Keep orientation state in sync with props
  useEffect(() => {
    setOrientation(data.orientation || "");
    setCustomOrientation(data.customOrientation || "");
  }, [data.orientation, data.customOrientation]);

  const handleOrientationChange = (value) => {
    setOrientation(value);
    update({ orientation: value, customOrientation: "" });
    if (value !== "Other") {
      setCustomOrientation("");
    }
  };

  const handleCustomOrientation = (value) => {
    setCustomOrientation(value);
    update({ customOrientation: value });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-2 text-pink-600">Personal Information</h2>

      {/* Username */}

      <label className="flex flex-col">
        <span className="text-gray-700 font-medium ">
            Username <span className="text-red-500">*</span>
        </span>
            <input
        label="Username"
        required
        value={user?.username || ""}   
        onChange={() => {}}            
        error={errors.username}
        placeholder="Username"
        readOnly
        disabled
      />
      </label>



      {/* Phone */}
      <FormInput
        label="Phone Number"
        required
        value={data.phone}
        onChange={(e) => update({ phone: e.target.value })}
        error={errors.phone}
        placeholder="Phone Number"
        type="number"
      />

      {/* Gender */}
      <FormSelect
        label="Gender"
        required
        value={data.gender}
        onChange={(e) => update({ gender: e.target.value })}
        error={errors.gender}
        options={[
          { value: "", label: "Select Gender" },
          { value: "female", label: "Female" },
          { value: "male", label: "Male" },
          { value: "shemale", label: "Shemale" },
          { value: "other", label: "Other" },
        ]}
      />

      {/* Age */}
      <FormInput
        label="Age"
        type="number"
        required
        value={data.age}
        onChange={(e) => update({ age: e.target.value })}
        error={errors.age}
        placeholder="Age"
      />

      {/* Orientation */}
      <FormSelect
        label="Sexual Orientation"
        required
        value={orientation}
        onChange={(e) => handleOrientationChange(e.target.value)}
        error={errors.orientation}
        options={[
          { value: "", label: "Select Orientation" },
          { value: "Straight", label: "Straight" },
          { value: "Gay", label: "Gay" },
          { value: "Lesbian", label: "Lesbian" },
          { value: "Bisexual", label: "Bisexual" },
          { value: "Other", label: "Other" },
        ]}
      />

      {/* Custom Orientation if "Other" */}
      {orientation === "Other" && (
        <FormInput
          label="Specify Orientation"
          required
          value={customOrientation}
          onChange={(e) => handleCustomOrientation(e.target.value)}
          error={errors.customOrientation}
          placeholder="Please specify"
        />
      )}

      {/* Complexion */}
      <FormInput
        label="Complexion"
        value={data.complexity}
        onChange={(e) => update({ complexity: e.target.value })}
        placeholder="Complexion"
      />

      {/* Ethnicity */}
      <FormInput
        label="Ethnicity"
        value={data.ethnicity}
        onChange={(e) => update({ ethnicity: e.target.value })}
        placeholder="Ethnicity"
      />
    </div>
  );
}

// ✅ Reusable input component
function FormInput({ label, value, onChange, placeholder, error, required = false, type = "text" }) {
  return (
    <label className="block">
      <span className="text-gray-700 font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`mt-1 w-full p-3 rounded-lg border ${
          error ? "border-red-400 focus:ring-red-300" : "border-pink-300 focus:ring-pink-300"
        } focus:outline-none focus:ring-2`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </label>
  );
}

// ✅ Reusable select component
function FormSelect({ label, value, onChange, options, error, required = false }) {
  return (
    <label className="block">
      <span className="text-gray-700 font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <select
        value={value}
        onChange={onChange}
        className={`mt-1 w-full p-3 rounded-lg border ${
          error ? "border-red-400 focus:ring-red-300" : "border-pink-300 focus:ring-pink-300"
        } focus:outline-none focus:ring-2`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </label>
  );
}
