import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateAccount() {
  const [agree, setAgree] = useState(false);
  const nav = useNavigate();

  const handleContinue = () => {
    // handle logic here, e.g., navigate to payment or next step
    nav("/onboading"); // or wherever you want to send them
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4 py-10">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-xl w-full">
        <h1 className="text-3xl font-bold text-pink-600 mb-4 text-center">
          Activate Your Account
        </h1>
        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          Welcome to <span className="font-semibold">Mautamuhub</span>!  
          To be listed and discovered as an escort on our platform, you need to
          activate your account. Activation helps us verify your profile and
          ensure that our community remains safe, trustworthy, and vibrant.
        </p>
        <p className="text-gray-700 leading-relaxed mb-6">
          By activating your account, you agree to present accurate information
          and uphold professional conduct while on our platform. Please review
          and accept our terms and conditions before proceeding.
        </p>
        <div className="flex items-start mb-6">
          <input
            id="agree"
            type="checkbox"
            checked={agree}
            onChange={() => setAgree(!agree)}
            className="mt-1 h-5 w-5 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
          />
          <label
            htmlFor="agree"
            className="ml-3 text-gray-700 text-base leading-snug"
          >
            I have read and agree to the{" "}
            <a
              href="/terms-and-conditions"
              className="text-pink-600 hover:underline font-medium"
            >
              Terms and Conditions
            </a>{" "}
            of using Mautamuhub as a listed escort.
          </label>
        </div>
        <button
          onClick={handleContinue}
          disabled={!agree}
          className={`w-full py-3 rounded-xl text-lg font-semibold transition-colors duration-200 ${
            agree
              ? "bg-pink-600 text-white hover:bg-pink-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {agree ? "Continue to Activation" : "Agree to Continue"}
        </button>
        <p className="text-sm text-gray-500 mt-6 text-center">
          Need help? Contact our{" "}
          <a href="/support" className="text-pink-600 hover:underline">
            Support Team
          </a>{" "}
          anytime.
        </p>
      </div>
    </div>
  );
}
