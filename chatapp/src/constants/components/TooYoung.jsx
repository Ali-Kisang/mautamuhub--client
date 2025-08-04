import { useEffect } from "react";

const TooYoung = () => {
  useEffect(() => {
    // Redirect to a kids' site after 8 seconds
    const timer = setTimeout(() => {
      window.location.href = "https://pbskids.org/";
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-yellow-50 flex items-center justify-center px-4 text-center">
      <div className="max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <img
          src="https://media.giphy.com/media/j2nYVx4UqCPbO/giphy.gif"
          alt="Crying Baby"
          className="w-48 h-48 mx-auto mb-6 rounded-full"
        />
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Whoa there, champ! 🍼
        </h1>
        <p className="text-gray-700 mb-2">
          You're not old enough to hang out here.
        </p>
        <p className="text-gray-500 mb-6">
          Come back in a few years… or go do your homework! 📚✏️
        </p>
        <p className="text-xs text-gray-400">
          Redirecting you to something more your speed...
        </p>
      </div>
    </div>
  );
};

export default TooYoung;
