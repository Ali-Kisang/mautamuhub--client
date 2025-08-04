
export const validateAdditionalInfo = (data) => {
  const errors = {};

  // Validate incallRate
  if (!data.incallRate || data.incallRate.trim() === "") {
    errors.incallRate = "Incall rate is required.";
  }

  // Validate outcallRate
  if (!data.outcallRate || data.outcallRate.trim() === "") {
    errors.outcallRate = "Outcall rate is required.";
  }

  // Validate description
  if (!data.description || data.description.trim().length < 20) {
    errors.description = "Description must be at least 20 characters.";
  }

  return errors;
};
