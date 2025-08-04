/* eslint-disable react/prop-types */
import React from "react";
import { TiTick } from "react-icons/ti";
import { motion } from "framer-motion";

const Stepper = ({ currentStep, setCurrentStep, totalSteps }) => {
  const isStepCompleted = (step) => step < currentStep;

  return (
    <>
      <h1 className="text-center text-2xl text-gray-800 mt-10 sm:text-3xl md:text-4xl">
        Create your Escort account now in few seconds!!
      </h1>
      <div className="flex items-center w-full max-w-4xl mx-auto py-10 px-4 relative overflow-x-auto sm:overflow-x-visible sm:flex-nowrap md:space-x-4">
        {Array.from({ length: totalSteps }, (_, index) => (
          <React.Fragment key={index}>
            {/* Step */}
            <motion.div
              className="flex flex-col items-center cursor-pointer mb-6 sm:mb-0"
              onClick={() => setCurrentStep(index + 1)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              {/* Tick Icon */}
              <div className="relative flex flex-col items-center">
                {isStepCompleted(index + 1) && (
                  <motion.div
                    className="absolute -top-8 sm:-top-10"
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <TiTick className="text-pink text-3xl sm:text-4xl font-bold" />
                  </motion.div>
                )}
                <motion.div
                  className={`w-12 h-12 flex items-center justify-center rounded-full ${
                    isStepCompleted(index + 1)
                      ? "bg-pink text-white"
                      : "bg-gray-300 text-gray-700"
                  }`}
                  whileHover={{ scale: 1.1 }}
                >
                  {index + 1}
                </motion.div>
              </div>

              {/* Step Label */}
              <p
                className={`mt-2 text-sm font-medium ${
                  isStepCompleted(index + 1) ? "text-pink" : "text-gray-700"
                } sm:text-base md:text-lg`}
              >
                {getStepLabel(index + 1)}
              </p>
            </motion.div>

            {/* Line */}
            {index < totalSteps - 1 && (
              <motion.div
                className={`h-1 flex-1 mx-2 ${
                  isStepCompleted(index + 2) ? "bg-pink" : "bg-gray-300"
                }`}
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              ></motion.div>
            )}
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

// Helper function to return step labels
const getStepLabel = (step) => {
  switch (step) {
    case 1:
      return "Personal Info";
    case 2:
      return "Select your location";
    case 3:
      return "Select from Google Map";
    case 4:
      return "Choose your services";
    case 5:
      return "Pick your payment plan";
    case 6:
      return "Upload Photos";
    case 7:
      return "Review and Post";
    default:
      return "";
  }
};

export default Stepper;
