import React from 'react';

const FreeTrialBanner = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 text-white py-4 px-6 rounded-lg shadow-xl shadow-pink-500/50 mx-auto max-w-sm md:max-w-md lg:max-w-2xl w-full group">
      {/* Vibrant multi-layer shine effect: colorful shimmer + pulse */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-200/30 to-transparent opacity-80 animate-shimmer-vibrant"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-200/20 to-transparent opacity-50 animate-shimmer-vibrant delay-1000"></div>
      
      {/* Pulsing glow border for extra vibrancy */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-pink-300/50 via-purple-300/50 to-pink-300/50 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      {/* Animated sparkle icons */}
      <div className="absolute top-2 right-2 text-2xl animate-bounce">✨</div>
      <div className="absolute top-1 left-2 text-lg animate-pulse delay-500">⭐</div>
      
      {/* Main content with subtle float animation */}
      <div className="relative z-10 text-center animate-float">
        <h2 className="text-lg md:text-xl font-bold tracking-wide mb-1 animate-pulse">
          1 Month Free Trial
        </h2>
        <p className="text-sm md:text-base opacity-90 font-medium">
          Start your journey today – no commitment!
        </p>
      </div>

      <style jsx>{`
        @keyframes shimmer-vibrant {
          0% {
            transform: translateX(-100%) scaleX(1);
          }
          50% {
            transform: translateX(50%) scaleX(1.1);
          }
          100% {
            transform: translateX(100%) scaleX(1);
          }
        }
        .animate-shimmer-vibrant {
          animation: shimmer-vibrant 1.5s ease-in-out infinite;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .delay-500 {
          animation-delay: 0.5s;
        }
      `}</style>
    </div>
  );
};

export default FreeTrialBanner;