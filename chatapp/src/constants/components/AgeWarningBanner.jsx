// components/AgeWarningBanner.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const AgeWarningBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const consent = Cookies.get("ageConsent");

    if (consent === "accepted") {
      // already accepted—nothing to do
      return;
    }

    if (consent === "declined") {
      // user already said no → force redirect
      navigate("/too-young", { replace: true });
      return;
    }

    // no cookie set yet → show the banner
    setShowBanner(true);
  }, [navigate]);

  const handleAccept = () => {
    Cookies.set("ageConsent", "accepted", { expires: 30 });
    setShowBanner(false);
  };

  const handleDecline = () => {
    Cookies.set("ageConsent", "declined", { expires: 30 });
    navigate("/too-young", { replace: true });
  };

  if (!showBanner) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center transition-opacity duration-500 ease-in-out">
      <div className="bg-white text-gray-800 rounded-2xl shadow-2xl p-6 md:p-10 max-w-xl mx-4 md:mx-auto text-center space-y-4">
        <h2 className="text-2xl md:text-3xl font-bold">🚫 Adults Only (18+)</h2>
        <p className="text-sm md:text-base">
          This website contains adult content, including nudity and explicit imagery.
          Viewer discretion is strongly advised.
        </p>
        <p className="text-sm text-coralPink">
          If you are under 18 or offended by such content, please click "Leave".
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4 mt-4">
          <button
            onClick={handleAccept}
            className="bg-pink-500 hover:bg-coralPink text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
          >
            Yes, I’m 18+ — Continue
          </button>
          <button
            onClick={handleDecline}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
          >
            No, Leave
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgeWarningBanner;
